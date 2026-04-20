import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3001"),
  title: {
    default: "Δρ. Παπαδόπουλος | Μαιευτήρας - Γυναικολόγος",
    template: "%s | Δρ. Παπαδόπουλος",
  },
  description: "Εξειδικευμένος Μαιευτήρας - Γυναικολόγος στην Καλαμάτα. Προγεννητικός έλεγχος, γυναικολογική εξέταση, υπερηχογράφημα, κολποσκόπηση.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={manrope.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
