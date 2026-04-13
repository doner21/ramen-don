"use client";

import { useEffect } from "react";

const OPENTABLE_URL = "https://www.opentable.co.uk/r/ramen-don-birmingham";

export default function OpenTableWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//www.opentable.co.uk/widget/reservation/loader?rid=297552&type=standard&theme=standard&color=1&dark=true&iframe=true&domain=couk&lang=en-GB&newtab=true&ot_source=Restaurant+website";
    script.async = true;
    const container = document.getElementById("ot-widget-container");
    if (container) container.appendChild(script);
    return () => {
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div id="ot-widget-container" className="min-h-[200px]" />
      <div className="mt-6 text-center">
        <p className="text-[#A09488] text-sm mb-4">
          Or book directly via OpenTable:
        </p>
        <a
          href={OPENTABLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#C8892A] text-[#1A1714] font-sans font-semibold px-8 py-3 hover:bg-[#d9992f] transition-colors"
          data-testid="opentable-link"
        >
          Reserve on OpenTable
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
