import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { checkSubscription } from "@/lib/subscription";

const LayoutPage = async ({ children }) => {
  const isPro = await checkSubscription();
  return (
    <div className="h-full">
      <Navbar isPro={isPro} />
      <div className="fixed bottom-6 right-6 md:inset-x-0 md:right-auto z-50 md:flex md:justify-center w-auto md:w-full pointer-events-none">
        <div className="pointer-events-auto">
          <Sidebar isPro={isPro} />
        </div>
      </div>

      <main className="md:pl-20 lg:pl-28 pt-2 md:pt-4 pb-24 h-full">{children}</main>
    </div>
  );
};

export default LayoutPage;
