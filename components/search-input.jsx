"use client";

import { useState, useEffect, useMemo, useTransition, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useDebounce } from "@/app/hooks/usedebounce";
import queryString from "query-string";
import { Search } from "lucide-react";

export const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_, startTransition] = useTransition();

  const categoryId = searchParams.get("categoryId");
  const nameParam = searchParams.get("name") || "";

  const [search, setSearch] = useState(nameParam);
  const debouncedValue = useDebounce(search, 250);

  useEffect(() => {
    if (debouncedValue === nameParam) return;

    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          name: debouncedValue || undefined,
          categoryId: categoryId || undefined,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  }, [debouncedValue, nameParam, categoryId, pathname, router, startTransition]);

  const handleChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setSearch("");

      const url = queryString.stringifyUrl(
        {
          url: pathname,
          query: {
            categoryId: categoryId || undefined,
            name: undefined,
          },
        },
        { skipEmptyString: true, skipNull: true }
      );

      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    },
    [pathname, categoryId, router, startTransition]
  );

  const placeholders = useMemo(
    () => [
      "Search companions...",
      "Who do you want to talk to?",
      "Find an AI friend...",
      "Discover new personalities...",
      "Explore AI characters...",
    ],
    []
  );

  return (
    <div className="relative w-full max-w-[640px] mx-auto group">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-purple-400 transition-colors z-10 pointer-events-none" />

      <PlaceholdersAndVanishInput
        value={search}
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={handleSubmit}
        className="search-bar h-12 md:h-14 rounded-full [&_input]:!pl-12 [&_p]:!pl-12"
      />
    </div>
  );
};

