import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { getDoctorProfile, getSiteSettings } from "@/lib/data/public";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3001"),
  title: {
    default: "Δημήτριος Ελ. Χριστακόπουλος MD, MSc | Μαιευτήρας - Γυναικολόγος",
    template: "%s | Δημήτριος Ελ. Χριστακόπουλος MD, MSc",
  },
  description: "Εξειδικευμένος Μαιευτήρας - Γυναικολόγος στην Καλαμάτα. Προγεννητικός έλεγχος, γυναικολογική εξέταση, υπερηχογράφημα, κολποσκόπηση.",
  robots: { index: true, follow: true },
};

function normalizeSocialUrl(value: string) {
  return value.startsWith("http") ? value : `https://instagram.com/${value.replace(/^@/, "")}`;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [doctor, settings] = await Promise.all([getDoctorProfile(), getSiteSettings()]);
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3001";

  const jsonLd = doctor
    ? {
        "@context": "https://schema.org",
        "@type": "Physician",
        name: doctor.name,
        description: doctor.title || undefined,
        image: doctor.photo_url || undefined,
        url: baseUrl,
        medicalSpecialty: ["Gynecologic", "Obstetric"],
        telephone: settings.phone || undefined,
        ...(settings.address
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: settings.address,
                addressLocality: "Καλαμάτα",
                addressCountry: "GR",
              },
            }
          : {}),
        sameAs: [settings.instagram, settings.facebook].filter(Boolean).map(normalizeSocialUrl),
      }
    : null;

  return (
    <html lang="el" className={manrope.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
