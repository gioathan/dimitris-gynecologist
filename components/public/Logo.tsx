export default function Logo({ showText = false, textDark = false, circled = false }: { showText?: boolean; textDark?: boolean; circled?: boolean }) {
  const size = showText ? 44 : 36;
  return (
    <div className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className={circled ? "rounded-full bg-white shadow-md shadow-black/15 p-1.5 shrink-0" : "shrink-0"}>
        <img
          src="/logo.png"
          alt="Λογότυπο Ιατρείου"
          width={size}
          height={size}
          className="object-contain block"
        />
      </div>
      {showText && (
        <div className="leading-tight">
          <p className={`text-xs font-bold tracking-widest ${textDark ? "text-on-surface" : "text-white"}`}>Δημήτριος Ελ. Χριστακόπουλος MD,MSc</p>
          <p className={`text-xs font-extrabold tracking-tight ${textDark ? "text-on-surface-variant" : "text-white"}`}>Μαιευτήρας-Γυναικολόγος Χειρουργός</p>
        </div>
      )}
    </div>
  );
}
