"use client";

import { useState, useEffect, useRef } from "react";

interface MenuNavProps {
  categories: { slug: string; name: string }[];
}

export default function MenuNav({ categories }: MenuNavProps) {
  const [active, setActive] = useState(categories[0]?.slug || "");
  const [navHeight, setNavHeight] = useState(57);
  const navRef = useRef<HTMLElement>(null);

  // Measure nav height once on mount and on resize — stable, not per-scroll
  useEffect(() => {
    const measure = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const getScrollOffset = (): number => {
    const headerHeight = window.matchMedia("(min-width: 1024px)").matches ? 80 : 64;
    return headerHeight + navHeight + 8;
  };

  // Use document.scrollingElement to handle iOS Safari where html{height:100%}
  // makes body the scroll container instead of window — window.scrollY/scrollTo won't work.
  const getScrollEl = (): Element =>
    document.scrollingElement || document.documentElement;

  useEffect(() => {
    const updateActive = () => {
      const scrollY = getScrollEl().scrollTop;
      const offset = getScrollOffset();
      let currentSlug = categories[0]?.slug || "";

      for (const cat of categories) {
        const el = document.getElementById(`cat-${cat.slug}`);
        if (el) {
          const elTop = el.getBoundingClientRect().top + scrollY;
          if (scrollY >= elTop - offset) {
            currentSlug = cat.slug;
          }
        }
      }

      setActive(currentSlug);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [categories, navHeight]);

  const scrollTo = (slug: string) => {
    const el = document.getElementById(`cat-${slug}`);
    if (!el) return;
    const scrollY = getScrollEl().scrollTop;
    const top = el.getBoundingClientRect().top + scrollY - getScrollOffset();
    getScrollEl().scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      className="sticky top-16 lg:top-20 z-40 bg-[#1A1714]/95 backdrop-blur-sm border-b border-[#3D3229] overflow-x-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 py-3 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => scrollTo(cat.slug)}
              style={{ touchAction: "manipulation" }}
              className={`px-4 py-1.5 text-sm font-sans font-medium tracking-wide transition-all whitespace-nowrap ${
                active === cat.slug
                  ? "bg-[#C8892A] text-[#1A1714]"
                  : "text-[#A09488] hover:text-[#F0EBE3]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
