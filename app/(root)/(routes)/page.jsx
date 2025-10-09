import { Companions } from "@/components/companions";
import { Categories } from "@/components/categories";
import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

const RootPage = async ({ searchParams }) => {
  const { userId } = await auth();
  const resolvedSearchParams = await searchParams;
  const data = await prismadb.companion.findMany({
    where: {
      userId,
      ...(resolvedSearchParams.categoryId && {
        categoryId: resolvedSearchParams.categoryId,
      }),
      ...(resolvedSearchParams.name && {
        name: {
          contains: resolvedSearchParams.name,
          mode: "insensitive",
        },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  const categories = await prismadb.category.findMany();
  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Companions data={data} />
    </div>
  );
};

export default RootPage;
