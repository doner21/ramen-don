"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { ReactNode } from "react";
import { BOOKING_OVERLAY_FALLBACK_IMAGE, BOOKING_OVERLAY_FALLBACK_ALT } from "@/lib/data/constants";

interface BookingOverlayProps {
  widgetUrl: string;
  overlayImage?: { src: string; alt: string } | null;
  children: ReactNode;
}

export default function BookingOverlay({ widgetUrl, overlayImage, children }: BookingOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollYRef = useRef(0);

  const imageSrc = overlayImage?.src || BOOKING_OVERLAY_FALLBACK_IMAGE;
  const imageAlt = overlayImage?.alt || BOOKING_OVERLAY_FALLBACK_ALT;

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = useCallback(() => {
    scrollYRef.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollYRef.current);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Layer 2: Navigation API guard — blocks parent-window navigation by OT's loader script.
  // The sandbox (Layer 1) blocks iframe→window.top navigation. This guard blocks the
  // postMessage→parent-script→window.location.href path that the sandbox cannot reach.
  useEffect(() => {
    if (!isOpen) return;
    if (!("navigation" in window)) return;

    const nav = (window as any).navigation;
    const handleNavigate = (event: any) => {
      const destUrl: string = event.destination?.url ?? "";
      if (!destUrl.startsWith(window.location.origin)) {
        event.preventDefault();
      }
    };

    nav.addEventListener("navigate", handleNavigate);
    return () => nav.removeEventListener("navigate", handleNavigate);
  }, [isOpen]);

  // Restore body scroll styles on unmount — guards against scroll-lock if overlay is open during page navigation
  useEffect(() => {
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, []);

  useEffect(() => {
    const holder = document.getElementById("ot-widget-holder");
    if (!holder) return;

    if (!isOpen) {
      // Clean up on close
      holder.innerHTML = "";
      const old = document.getElementById("ot-widget-script");
      if (old) old.remove();
      return;
    }

    // Clear stale content
    holder.innerHTML = "";
    const old = document.getElementById("ot-widget-script");
    if (old) old.remove();

    // Intercept iframe creation by OT's loader script and add sandbox before src is set.
    // This blocks window.top.location navigation (the cause of step 2→3 parent-page redirect).
    const originalCreateElement = document.createElement.bind(document);
    (document as any).createElement = function (tag: string, ...args: unknown[]) {
      const el = (originalCreateElement as any)(tag, ...args);
      if (typeof tag === "string" && tag.toLowerCase() === "iframe") {
        (el as HTMLIFrameElement).setAttribute(
          "sandbox",
          "allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        );
      }
      return el;
    };

    // Inject OT loader — use originalCreateElement so the script tag itself is not sandboxed
    const script = originalCreateElement("script") as HTMLScriptElement;
    script.id = "ot-widget-script";
    script.src = widgetUrl;
    script.async = true;
    holder.appendChild(script);

    // Restore createElement after OT's script has had time to create its iframe (~3s)
    const restoreTimer = setTimeout(() => {
      (document as any).createElement = originalCreateElement;
    }, 3000);

    return () => {
      clearTimeout(restoreTimer);
      (document as any).createElement = originalCreateElement;
    };
  }, [isOpen, widgetUrl]);

  return (
    <>
      {/* Trigger — plain span wrapper; touch-hittable on iOS Safari (no display:contents) */}
      <span onClick={open} style={{ display: "inline-block", cursor: "pointer" }}>
        {children}
      </span>

      {/* Portal — only rendered on client after mount */}
      {mounted && isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Book a Table"
            onClick={close}
          >
            {/* Panel — full-bleed image background with centered floating widget */}
            <div
              className="relative w-full max-w-4xl mx-4 bg-[#1A1714] border border-[#3D3229] rounded-lg overflow-hidden"
              style={{ height: "min(90vh, 620px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Full-bleed background image */}
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 896px, 100vw"
                priority={false}
              />

              {/* Subtle scrim — darkens the image slightly for widget legibility, NOT fully opaque */}
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              {/* Close button — z-20 so it sits above scrim and widget card */}
              <button
                type="button"
                onClick={close}
                aria-label="Close booking overlay"
                data-testid="booking-overlay-close"
                className="absolute top-3 right-3 z-20 p-2 text-[#A09488] hover:text-[#F0EBE3] transition-colors bg-[#1A1714]/80 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Centered widget wrapper — sits above scrim, centers the widget card */}
              <div className="absolute inset-0 z-10 flex items-center justify-center p-4 md:p-6">
                {/* Widget card — semi-transparent dark panel for readability */}
                <div className="bg-[#1A1714]/85 backdrop-blur-sm border border-[#3D3229] rounded-lg p-4 md:p-6 max-w-full">
                  {/* Widget inline holder — OpenTable script injects HTML here */}
                  <div
                    id="ot-widget-holder"
                    data-testid="booking-overlay-widget"
                    className="overflow-auto"
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
