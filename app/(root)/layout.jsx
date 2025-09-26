import { NavBar } from "@/components/navbar";
import { SearchFilter } from "@/components/search-input";
import { SideBar } from "@/components/sidebar";

const LayoutPage = ({ children }) => {
  return (
    <div className="h-full">
      <NavBar />
      <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0 ">
        <SideBar />
      </div>

      <main className="md:pl-20 pt-16 h-full">{children}</main>
    </div>
  );
};

export default LayoutPage;
