import { CompanionForm } from "@/app/(root)/(routes)/companion/[companionId]/components/companionForm";
import prismadb from "@/lib/prismadb";

const CompanionIdPage = async ({ params }) => {
  const resolvedParams = await params;
  //Todo Subcription

  const companion = await prismadb.companion.findUnique({
    where: {
      id: resolvedParams.companionId,
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
