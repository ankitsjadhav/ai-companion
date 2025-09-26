"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { debounce } from "@/app/hooks/usedebounce";
import queryString from "query-string";
import { Search } from "lucide-react";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryID = searchParams.get("categoryID");
  const name = searchParams.get("name");

  const [search, setSearch] = useState(name || "");

  const debounceValue = debounce(search, 500);

  useEffect(() => {
    const query = {
      name: debounceValue,
      categoryID: categoryID,
    };

    const url = queryString.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );
    return router.push(url);
  }, [debounceValue, router, categoryID]);

  return (
    <div className="relative">
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="pl-10 bg-primary/10"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};
