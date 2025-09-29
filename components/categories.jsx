"use client";

import { cn } from "@/lib/utils";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

export const Categories = ({ data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const categoryId = searchParams.get("categoryId");
  const onClick = (id) => {
    const query = { categoryId: id };

    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="w-full overflow-x-auto space-x-2 flex p-1">
      <button
        onClick={() => onClick(undefined)}
        className={cn(
          `flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition cursor-pointer`,
          !categoryId ? "bg-primary/25" : "bg-primary/10"
        )}
      >
        Newest
      </button>
      {data.map((item) => (
        <button
          onClick={() => onClick(item.id)}
          key={item.id}
          className={cn(
            `flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition cursor-pointer`,
            item.id === categoryId ? "bg-primary/25" : "bg-primary/10"
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};
