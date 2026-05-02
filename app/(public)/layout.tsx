import Header from "@/components/public/HeaderServer";
import Footer from "@/components/public/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="pt-16 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
