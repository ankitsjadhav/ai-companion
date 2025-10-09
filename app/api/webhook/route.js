// app/api/webhook/route.js
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

async function findUserId({ invoice, subscription, customerId }) {
  if (invoice?.metadata?.userId) return invoice.metadata.userId;

  if (subscription?.metadata?.userId) return subscription.metadata.userId;

  if (customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer?.metadata?.userId) return customer.metadata.userId;
    } catch (err) {
      console.warn(
        "[WEBHOOK] Failed to retrieve customer for userId lookup:",
        err?.message
      );
    }
  }

  if (customerId) {
    try {
      const user = await prismadb.user.findFirst({
        where: { stripeCustomerId: customerId },
      });
      if (user) return user.id;
    } catch (err) {
      console.warn(
        "[WEBHOOK] DB lookup by stripeCustomerId failed:",
        err?.message
      );
    }
  }

  return null;
}

function getSubscriptionIdFromInvoice(invoice) {
  if (invoice?.subscription) return invoice.subscription;

  if (invoice?.lines?.data?.length) {
    for (const line of invoice.lines.data) {
      if (line?.subscription_item_details?.subscription) {
        return line.subscription_item_details.subscription;
      }

      if (line?.parent?.subscription_details?.subscription) {
        return line.parent.subscription_details.subscription;
      }
    }
  }

  if (invoice?.parent?.subscription_details?.subscription) {
    return invoice.parent.subscription_details.subscription;
  }

  return null;
}

function getPeriodEnd({ subscription, invoice }) {
  if (subscription?.current_period_end) return subscription.current_period_end;

  if (subscription?.items?.data?.length) {
    for (const item of subscription.items.data) {
      if (item?.current_period_end) return item.current_period_end;
    }
  }

  if (subscription?.latest_invoice?.period_end)
    return subscription.latest_invoice.period_end;

  if (invoice?.lines?.data?.length) {
    for (const line of invoice.lines.data) {
      if (line?.period?.end) return line.period.end;
    }
  }

  return null;
}

export async function POST(req) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[WEBHOOK] Signature verification failed:", err?.message);
    return new NextResponse(`Webhook Error: ${err?.message}`, { status: 400 });
  }

  console.log("🔔 Webhook Event:", event.type, "id:", event.id);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("checkout.session.completed — session:", {
        id: session.id,
        subscription: session.subscription,
        client_reference_id: session.client_reference_id,
        metadata: session.metadata,
      });

      if (session.client_reference_id && session.customer) {
        try {
          await stripe.customers.update(session.customer, {
            metadata: { userId: session.client_reference_id },
          });
          console.log(
            "[WEBHOOK] customer metadata updated with userId:",
            session.client_reference_id
          );
        } catch (err) {
          console.warn(
            "[WEBHOOK] Failed to update customer metadata:",
            err?.message
          );
        }
      }

      return new NextResponse(null, { status: 200 });
    }

    if (
      event.type === "invoice.payment_succeeded" ||
      event.type === "invoice.paid" ||
      event.type === "invoice_payment.paid" ||
      event.type === "invoice.finalized"
    ) {
      const invoice = event.data.object;
      console.log(
        "invoice event id:",
        invoice.id,
        "lines:",
        invoice.lines?.data?.length
      );

      let subscriptionId = getSubscriptionIdFromInvoice(invoice);

      if (!subscriptionId) {
        console.log(
          "[WEBHOOK] No subscription ID on invoice — treating as one-time invoice."
        );

        const customerId = invoice.customer;
        let userId = null;
        if (customerId) {
          try {
            const customer = await stripe.customers.retrieve(customerId);
            userId = customer?.metadata?.userId ?? null;
          } catch (err) {
            console.warn(
              "[WEBHOOK] Failed to retrieve customer for one-time invoice:",
              err?.message
            );
          }
        }

        if (userId) {
          await prismadb.userSubscription.upsert({
            where: { stripeSubscriptionId: `one-time-${invoice.id}` },
            create: {
              userId,
              stripeSubscriptionId: `one-time-${invoice.id}`,
              stripeCustomerId: invoice.customer,
              stripePriceId: invoice.lines?.data?.[0]?.price?.id ?? null,

              stripeCurrentPeriodEnd: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ),
            },
            update: {
              stripePriceId: invoice.lines?.data?.[0]?.price?.id ?? null,
              stripeCurrentPeriodEnd: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ),
            },
          });
          console.log(
            "[WEBHOOK] One-time invoice processed and upserted to DB for user:",
            userId
          );
        } else {
          console.log(
            "[WEBHOOK] No userId for one-time invoice — skipping DB write."
          );
        }

        return new NextResponse(null, { status: 200 });
      }

      let subscription;
      try {
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
      } catch (err) {
        console.error(
          "[WEBHOOK] Failed to retrieve subscription:",
          err?.message
        );
        return new NextResponse("temporary failure", { status: 500 });
      }

      let userId = await findUserId({
        invoice,
        subscription,
        customerId: invoice.customer,
      });

      if (!userId) {
        console.warn(
          "[WEBHOOK] Could not determine userId for subscription:",
          subscriptionId
        );

        return new NextResponse(null, { status: 200 });
      }

      const periodEnd = getPeriodEnd({ subscription, invoice });
      if (!periodEnd) {
        console.warn(
          "[WEBHOOK] Could not determine period end for subscription:",
          subscriptionId
        );
        return new NextResponse(null, { status: 200 });
      }

      const periodEndDate = new Date(periodEnd * 1000);

      const priceId =
        subscription?.items?.data?.[0]?.price?.id ||
        invoice?.lines?.data?.[0]?.price?.id ||
        null;

      try {
        const result = await prismadb.userSubscription.upsert({
          where: { stripeSubscriptionId: subscription.id },
          create: {
            userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: periodEndDate,
          },
          update: {
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: periodEndDate,
          },
        });
        console.log(
          "[WEBHOOK] Upsert result:",
          JSON.stringify(result, null, 2)
        );
      } catch (err) {
        console.error("[WEBHOOK] DB upsert failed:", err?.message, err);

        return new NextResponse("temporary failure", { status: 500 });
      }

      return new NextResponse(null, { status: 200 });
    }

    console.log("[WEBHOOK] Skipping event type:", event.type);
    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error("[WEBHOOK] Unexpected error:", err);

    return new NextResponse(null, { status: 200 });
  }
}
