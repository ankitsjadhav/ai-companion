"use client";

import React, { useState } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function SubscriptionButton({ isPro }) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const demoEmail = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL;
  const isDemo = user?.emailAddresses?.[0]?.emailAddress === demoEmail;

  const onClick = async () => {
    if (isDemo) {
      toast.info("Billing functionality is disabled in demo mode.");
      return;
    }
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something Went Wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-y-2">
      <Button
        size="sm"
        variant={isPro ? "default" : "premium"}
        disabled={loading}
        onClick={onClick}
      >
        {isPro ? "Manage Subscription" : "Upgrade"}
        {!isPro && <Sparkles className="w-4 h-4 ml-2 fill-white" />}
      </Button>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">
        Payments powered by Stripe
      </p>
    </div>
  );
}
