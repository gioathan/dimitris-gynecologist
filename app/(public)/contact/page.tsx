import { getSiteSettings } from "@/lib/data/public";
import ContactForm from "@/components/public/ContactForm";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Επικοινωνία",
  description: "Επικοινωνήστε μαζί μας για ραντεβού, πληροφορίες υπηρεσιών ή οποιαδήποτε άλλη ερώτηση.",
  openGraph: {
    title: "Επικοινωνία | Δρ. Παπαδόπουλος",
    description: "Στείλτε μας μήνυμα ή καλέστε μας για κλείσιμο ραντεβού.",
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactItems = [
    { key: "address", icon: "location_on", label: "Διεύθυνση", value: settings.address },
    { key: "phone",   icon: "call",         label: "Τηλέφωνο",  value: settings.phone   },
    { key: "email",   icon: "alternate_email", label: "Email",   value: settings.email   },
  ].filter((c) => c.value);

  return (
    <section className="bg-surface-container-high min-h-[calc(100vh-4rem)]">
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
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-secondary font-bold mb-1">{label}</p>
                  {key === "phone" ? (
                    <a href={`tel:${value!.replace(/\s/g, "")}`} className="text-on-surface font-semibold hover:text-primary transition-colors">
                      {value}
                    </a>
                  ) : key === "email" ? (
                    <a href={`mailto:${value}`} className="text-on-surface font-semibold hover:text-primary transition-colors">
                      {value}
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
