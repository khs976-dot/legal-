"use client";

import { useRef } from "react";

export function HeroScene() {
  const stage = useRef<HTMLDivElement>(null);

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = stage.current;
    if (!el) {
      return;
    }
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
  }

  function onLeave() {
    const el = stage.current;
    if (!el) {
      return;
    }
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div
      ref={stage}
      className="hero-stage"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-hidden="true"
    >
      <div className="hero-rig">
        <span className="hero-plane hero-plane-a" />
        <span className="hero-plane hero-plane-b" />
        <span className="hero-plane hero-plane-c" />
        <span className="hero-orb" />
        <span className="hero-ring" />
      </div>
    </div>
  );
}
