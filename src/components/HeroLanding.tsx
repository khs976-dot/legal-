"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Locale, SiteContent } from "@/lib/types";

type HeroLandingProps = {
  locale: Locale;
  content: SiteContent;
};

export function HeroLanding({ locale, content }: HeroLandingProps) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const otherName =
    locale === "ar" ? content.identity.nameEn : content.identity.nameAr;
  const headline =
    locale === "ar" ? content.hero.headlineAr : content.hero.headlineEn;
  const eyebrow =
    locale === "ar" ? content.hero.eyebrowAr : content.hero.eyebrowEn;
  const line =
    locale === "ar" ? content.hero.subheadlineAr : content.hero.subheadlineEn;
  const title =
    locale === "ar" ? content.identity.titleAr : content.identity.titleEn;
  const cta = locale === "ar" ? content.cta.labelAr : content.cta.labelEn;

  useEffect(() => {
    const root = stage.current;
    const surface = canvas.current;
    if (!root || !surface) {
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return;
    }

    const onMove = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      root.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`);
      root.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
      root.style.setProperty("--pan-x", `${(x * 24).toFixed(1)}px`);
      root.style.setProperty("--pan-y", `${(y * 16).toFixed(1)}px`);
    };

    const onLeave = () => {
      root.style.setProperty("--tilt-x", "0deg");
      root.style.setProperty("--tilt-y", "0deg");
      root.style.setProperty("--pan-x", "0px");
      root.style.setProperty("--pan-y", "0px");
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    const ctx = surface.getContext("2d");
    if (!ctx) {
      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    }

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const count = mobile ? 22 : 64;
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;

    const motes = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.3 + Math.random() * 0.7,
      r: 0.4 + Math.random() * 1.6,
      drift: -0.04 - Math.random() * 0.08,
    }));

    const resize = () => {
      const box = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = box.width;
      height = box.height;
      surface.width = Math.floor(width * dpr);
      surface.height = Math.floor(height * dpr);
      surface.style.width = `${width}px`;
      surface.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!running) {
        return;
      }
      ctx.clearRect(0, 0, width, height);
      for (const mote of motes) {
        mote.y += mote.drift * 0.01;
        mote.x += Math.sin(frame * 0.004 + mote.z * 8) * 0.00035;
        if (mote.y < -0.02) {
          mote.y = 1.02;
          mote.x = Math.random();
        }
        const alpha = 0.18 + mote.z * 0.45;
        ctx.beginPath();
        ctx.fillStyle = `rgba(224, 197, 122, ${alpha})`;
        ctx.arc(mote.x * width, mote.y * height, mote.r * mote.z, 0, Math.PI * 2);
        ctx.fill();
      }
      frame += 1;
      requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section ref={stage} className="landing-hero" aria-label={headline}>
      <canvas ref={canvas} className="landing-particles" aria-hidden="true" />
      <div className="landing-bloom" aria-hidden="true" />
      <div className="landing-beams" aria-hidden="true" />
      <div className="landing-chamber" aria-hidden="true">
        <span className="landing-column landing-column-a" />
        <span className="landing-column landing-column-b" />
        <span className="landing-doc landing-doc-a" />
        <span className="landing-doc landing-doc-b" />
        <span className="landing-doc landing-doc-c" />
        <span className="landing-ring landing-ring-a" />
        <span className="landing-ring landing-ring-b" />
        <span className="landing-ring landing-ring-c" />
        <svg className="landing-scales" viewBox="0 0 200 200" fill="none">
          <path
            d="M100 28v118"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="100" cy="26" r="5" fill="currentColor" />
          <path d="M78 146h44" stroke="currentColor" strokeWidth="3" />
          <path d="M70 154h60" stroke="currentColor" strokeWidth="6" />
          <g className="landing-beam">
            <path
              d="M38 72h124"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path d="M38 72l-18 36h36z" className="landing-pan" />
            <path d="M162 72l-18 36h36z" className="landing-pan" />
            <path d="M38 72v8M162 72v8" stroke="currentColor" strokeWidth="1.4" />
          </g>
        </svg>
      </div>
      <div className="landing-copy">
        <p className="landing-line landing-line-1">{eyebrow}</p>
        <h1 className="landing-line landing-line-2 font-display">{headline}</h1>
        <p className="landing-line landing-line-3">{otherName}</p>
        <p className="landing-line landing-line-4">{line}</p>
        <p className="landing-line landing-line-5">{title}</p>
        <Link href="#inquiry" className="landing-line landing-line-6 landing-cta">
          {cta}
        </Link>
      </div>
    </section>
  );
}
