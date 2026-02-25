"use client";

import React, { useMemo, useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { Tabs } from "@/components/ui/tabs";

export const Categories = ({ data }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const categoryId = searchParams.get("categoryId");
  const currentName = searchParams.get("name");

  const mappedTabs = useMemo(() => {
    return [
      { title: "Newest", value: "newest", content: <div /> },
      ...data.map((item) => ({
        title: item.name,
        value: item.id,
        content: <div />,
      })),
    ];
  }, [data]);

  const handleClick = useCallback(
    (id) => {
      const url = queryString.stringifyUrl(
        {
          url: pathname,
          query: {
            categoryId: id,
            name: currentName,
          },
        },
        { skipNull: true, skipEmptyString: true }
      );

      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [pathname, router, currentName]
  );

  return (
    <div className="w-full mt-2 md:mt-4 mb-4 md:mb-6 flex justify-start sm:justify-center px-4 md:px-2 overflow-x-auto no-scrollbar pt-2 pb-4">
      <div className="w-fit flex">
        <Tabs
          tabs={mappedTabs}
          containerClassName="gap-2 md:gap-3"
          onTabClick={(tab) =>
            handleClick(tab.value === "newest" ? undefined : tab.value)
          }
          activeTabClassName="bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md text-white rounded-xl md:rounded-2xl"
          tabClassName="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 md:px-7 md:py-4 rounded-xl md:rounded-2xl bg-secondary/40 text-secondary-foreground text-xs md:text-sm font-medium border border-white/5 hover:bg-secondary hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200"
        />
      </div>
    </div>
  );
};

