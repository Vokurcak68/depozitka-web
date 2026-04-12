"use client";

import Script from "next/script";
import { useEffect, useId } from "react";

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

  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const tryRender = () => {
      if (!window.turnstile) return false;
      try {
        window.turnstile.render(el, {
          sitekey: siteKey,
          action,
          callback: (token) => onToken(token),
        });
        return true;
      } catch {
        return false;
      }
    };

    // Try immediately then a couple of times.
    if (tryRender()) return;
    const t = setInterval(() => {
      if (tryRender()) clearInterval(t);
    }, 250);

    return () => clearInterval(t);
  }, [id, siteKey, action, onToken]);

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
