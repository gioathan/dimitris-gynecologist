import Header from "@/components/public/HeaderServer";
import Footer from "@/components/public/Footer";
import ScrollToTop from "@/components/public/ScrollToTop";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-secondary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
      >
        Μετάβαση στο κύριο περιεχόμενο
      </a>
      <Header />
      <main id="main-content" className="pt-16 flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
