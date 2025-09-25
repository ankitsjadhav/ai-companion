import { NavBar } from "@/components/navbar";

const LayoutPage = ({ children }) => {
  return (
    <div className="h-full">
      <NavBar />
      <main className="md:pl-20 pt-16 h-full">{children}</main>
    </div>
  );
};

export default LayoutPage;
