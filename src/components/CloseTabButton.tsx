"use client";

import { useCallback, useState } from "react";

export default function CloseTabButton({ fallbackUrl }: { fallbackUrl: string }) {
  const [tried, setTried] = useState(false);

  const onClose = useCallback(() => {
    setTried(true);

    try {
      // Best-effort attempt to close the tab/window.
      // Works reliably only if the window was opened by script.
      window.open("", "_self");
      window.close();
    } catch {
      // ignore
    }

    // Fallback: navigate away so the user isn't stuck.
    setTimeout(() => {
      try {
        window.location.href = fallbackUrl;
      } catch {
        // ignore
      }
    }, 150);
  }, [fallbackUrl]);

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
      {tried && (
        <div className="hidden sm:block text-xs text-navy-600 bg-white/90 border border-navy-100 rounded-md px-2 py-1 shadow-sm">
          Prohlížeč nemusí dovolit zavřít záložku — přesměruju tě.
        </div>
      )}
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center gap-2 rounded-lg bg-white/95 border border-navy-100 px-3 py-2 text-sm font-semibold text-navy-800 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
        aria-label="Zavřít"
        title="Zavřít"
      >
        <span className="text-base leading-none">×</span>
        <span>Zavřít</span>
      </button>
    </div>
  );
}
