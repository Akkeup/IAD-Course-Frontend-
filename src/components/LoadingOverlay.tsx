export function LoadingOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return <div className="loading-overlay" role="status" aria-live="polite"><div className="spinner-border text-info" aria-hidden="true" /><span>Выполняется запрос…</span></div>;
}
