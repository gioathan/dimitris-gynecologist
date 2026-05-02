import { getSiteSettings } from "@/lib/data/public";
import ContactForm from "@/components/public/ContactForm";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Επικοινωνία",
  description: "Επικοινωνήστε μαζί μας για ραντεβού, πληροφορίες υπηρεσιών ή οποιαδήποτε άλλη ερώτηση.",
  openGraph: {
    title: "Επικοινωνία | Δημήτριος Ελ. Χριστακόπουλος MD, MSc",
    description: "Στείλτε μας μήνυμα ή καλέστε μας για κλείσιμο ραντεβού.",
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactItems = [
    { key: "address",      icon: "location_on",    label: "Διεύθυνση",  value: settings.address      },
    { key: "phone",        icon: "call",           label: "Τηλέφωνο",   value: settings.phone        },
    { key: "phone_mobile", icon: "smartphone",     label: "Κινητό",     value: settings.phone_mobile },
    { key: "email",        icon: "alternate_email",label: "Email",      value: settings.email        },
    { key: "instagram",    icon: "photo_camera",   label: "Instagram",  value: settings.instagram    },
  ].filter((c) => c.value);

  return (
    <section className="bg-surface-container min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-6 py-14 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── Left: info ──────────────────────────────────── */}
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface mb-4 tracking-tight">
            Επικοινωνήστε μαζί μας
          </h1>
          <p className="text-on-surface-variant text-base leading-relaxed mb-12 max-w-md">
            Είτε έχετε μια ερώτηση σχετικά με τις υπηρεσίες μας, είτε θέλετε να κλείσετε ραντεβού,
            η ομάδα μας είναι εδώ για εσάς.
          </p>

          <div className="space-y-8">
            {contactItems.map(({ key, icon, label, value }) => (
              <div key={key} className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm shrink-0">
                  {key === "instagram" ? (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-secondary" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  ) : (
                    <span className="material-symbols-outlined">{icon}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-secondary font-bold mb-1">{label}</p>
                  {key === "phone" || key === "phone_mobile" ? (
                    <a href={`tel:${value!.replace(/\s/g, "")}`} className="text-on-surface font-semibold hover:text-primary transition-colors">
                      {value}
                    </a>
                  ) : key === "email" ? (
                    <a href={`mailto:${value}`} className="text-on-surface font-semibold hover:text-primary transition-colors">
                      {value}
                    </a>
                  ) : key === "instagram" ? (
                    <a
                      href={value!.startsWith("http") ? value! : `https://instagram.com/${value!.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface font-semibold hover:text-primary transition-colors"
                    >
                      {value!.startsWith("http") ? value : `@${value!.replace(/^@/, "")}`}
                    </a>
                  ) : (
                    <p className="text-on-surface font-semibold">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: form ─────────────────────────────────── */}
        <div className="bg-surface-container-lowest/80 glass-panel p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-on-surface/5">
          <h2 className="text-2xl font-bold mb-7 text-on-surface">Στείλτε μας Μήνυμα</h2>
          <ContactForm />
        </div>

      </div>
    </section>
  );
}
