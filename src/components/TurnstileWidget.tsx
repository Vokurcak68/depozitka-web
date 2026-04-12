"use client";

import Script from "next/script";
import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          action?: string;
          callback: (token: string) => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export default function TurnstileWidget({
  siteKey,
  action,
  onToken,
}: {
  siteKey: string;
  action: string;
  onToken: (token: string) => void;
}) {
  const id = useId();

  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);

  // keep latest callback without re-rendering the widget
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const tryRender = () => {
      if (widgetIdRef.current) return true;
      if (!window.turnstile) return false;

      try {
        // Ensure no duplicates if effect re-runs (React strict mode / re-renders)
        el.innerHTML = "";

        const wid = window.turnstile.render(el, {
          sitekey: siteKey,
          action,
          callback: (token) => onTokenRef.current(token),
        });

        widgetIdRef.current = wid;
        return true;
      } catch {
        return false;
      }
    };

    // Try immediately then retry until script is loaded.
    if (tryRender()) return;

    const t = window.setInterval(() => {
      if (tryRender()) window.clearInterval(t);
    }, 250);

    return () => {
      window.clearInterval(t);
      try {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } catch {
        // ignore
      }
      widgetIdRef.current = null;
      try {
        el.innerHTML = "";
      } catch {
        // ignore
      }
    };
  }, [id, siteKey, action]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div id={id} />
    </>
  );
}
