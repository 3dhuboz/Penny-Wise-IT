// Phase 3 — Penny Wise I.T branded header for client viewer
export function BrandedHeader() {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-brand-dark">Penny Wise I.T</span>
        <span className="text-sm text-slate-400">DeliverView</span>
      </div>
    </header>
  );
}
