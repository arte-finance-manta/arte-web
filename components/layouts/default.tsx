import { Navbar } from "@/components/bar/navbar";
import { Footer } from "@/components/footer/footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-y-auto gap-5 overflow-x-hidden bg-gradient-to-r from-white to-[#fcf5ef] dark:from-black dark:to-[#1a1a1a]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
