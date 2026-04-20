export default function Logo({ showText = false }: { showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-sm shadow-primary/30 shrink-0">
        <span
          className="material-symbols-outlined text-white"
          style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
        >
          local_florist
        </span>
      </div>
      {showText && (
        <div className="leading-tight">
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Ιατρείο</p>
          <p className="text-sm font-extrabold text-on-surface tracking-tight">Παπαδόπουλος</p>
        </div>
      )}
    </div>
  );
}
