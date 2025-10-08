import { Menu } from "lucide-react";

import {
  SheetContent,
  Sheet,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import Sidebar from "./sidebar";

export const MobileSideBar = ({ isPro }) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-secondary pt-10 w-32">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Access navigation options
        </SheetDescription>
        <Sidebar isPro={isPro} />
      </SheetContent>
    </Sheet>
  );
};
