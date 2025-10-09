import { CompanionForm } from "@/app/(root)/(routes)/companion/[companionId]/components/companionForm";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CompanionIdPage = async ({ params }) => {
  const resolvedParams = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: resolvedParams.companionId,
      userId,
    },
  });

  const categories = await prismadb.category.findMany();

  return (
    <div>
      <CompanionForm initialData={companion} categories={categories} />
    </div>
  );
};

export default CompanionIdPage;
