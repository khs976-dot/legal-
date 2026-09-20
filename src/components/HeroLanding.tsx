"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Locale, SiteContent } from "@/lib/types";

type HeroLandingProps = {
  locale: Locale;
  content: SiteContent;
};

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv - 0.5;
  p.x *= u_res.x / max(u_res.y, 1.0);
  vec2 m = u_mouse * 0.22;
  p -= m;
  float t = u_time;
  float r = length(p);
  float a = atan(p.y, p.x);
  float rings = 0.5 + 0.5 * sin(r * 14.0 - t * 2.4);
  float veins = pow(abs(sin(a * 5.0 + t * 0.7 + r * 3.0)), 10.0);
  float sweep = pow(max(0.0, sin(a * 2.0 + t * 1.35)), 14.0);
  float bloom = exp(-r * 2.6) * (0.55 + 0.45 * sin(t * 0.9));
  float gold = rings * 0.16 + veins * 0.28 + sweep * 0.38 + bloom * 0.42;
  gold *= smoothstep(1.25, 0.08, r);
  vec3 deep = vec3(0.016, 0.043, 0.078);
  vec3 mid = vec3(0.043, 0.122, 0.227);
  vec3 navy = mix(deep, mid, clamp(uv.y * 1.1 + 0.08, 0.0, 1.0));
  vec3 g = vec3(0.878, 0.773, 0.478);
  gl_FragColor = vec4(navy + g * gold, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function startShader(
  canvas: HTMLCanvasElement,
  mouse: { x: number; y: number },
): (() => void) | null {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) {
    return null;
  }

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) {
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    return null;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return null;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(program, "a_pos");
  const uRes = gl.getUniformLocation(program, "u_res");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uMouse = gl.getUniformLocation(program, "u_mouse");
  const start = performance.now();
  let width = 0;
  let height = 0;
  let running = true;
  let frame = 0;

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    width = Math.max(1, Math.floor(box.width * dpr));
    height = Math.max(1, Math.floor(box.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };

  const draw = () => {
    if (!running) {
      return;
    }
    if (document.hidden) {
      frame = requestAnimationFrame(draw);
      return;
    }
    resize();
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(uRes, width, height);
    gl.uniform1f(uTime, (performance.now() - start) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    frame = requestAnimationFrame(draw);
  };

  draw();

  return () => {
    running = false;
    cancelAnimationFrame(frame);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
}

export function HeroLanding({ locale, content }: HeroLandingProps) {
  const stage = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLCanvasElement>(null);
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
    const shader = field.current;
    if (!root || !surface) {
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return;
    }

    const pointer = { x: 0, y: 0 };
    const target = { tx: 0, ty: 0, px: 0, py: 0 };
    const current = { tx: 0, ty: 0, px: 0, py: 0 };
    let scroll = 0;
    let running = true;
    let raf = 0;

    const applyMotion = () => {
      current.tx += (target.tx - current.tx) * 0.085;
      current.ty += (target.ty - current.ty) * 0.085;
      current.px += (target.px - current.px) * 0.09;
      current.py += (target.py - current.py) * 0.09;
      root.style.setProperty("--tilt-x", `${current.tx.toFixed(2)}deg`);
      root.style.setProperty("--tilt-y", `${current.ty.toFixed(2)}deg`);
      root.style.setProperty("--pan-x", `${current.px.toFixed(1)}px`);
      root.style.setProperty("--pan-y", `${current.py.toFixed(1)}px`);
      root.style.setProperty("--scroll", scroll.toFixed(3));
    };

    const onMove = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      pointer.x = x;
      pointer.y = -y;
      target.tx = -y * 16;
      target.ty = x * 20;
      target.px = x * 56;
      target.py = y * 40;
    };

    const onLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
      target.tx = 0;
      target.ty = 0;
      target.px = 0;
      target.py = 0;
    };

    const onScroll = () => {
      const box = root.getBoundingClientRect();
      const span = Math.max(box.height * 0.72, 1);
      scroll = Math.min(1, Math.max(0, -box.top / span));
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const stopShader = shader ? startShader(shader, pointer) : null;

    const ctx = surface.getContext("2d");
    if (!ctx) {
      const loop = () => {
        if (!running) {
          return;
        }
        applyMotion();
        raf = requestAnimationFrame(loop);
      };
      loop();
      return () => {
        running = false;
        cancelAnimationFrame(raf);
        stopShader?.();
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", onScroll);
      };
    }

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const moteCount = mobile ? 56 : 150;
    const streakCount = mobile ? 16 : 42;
    const sparkCount = mobile ? 8 : 18;
    let width = 0;
    let height = 0;
    let tick = 0;

    const motes = Array.from({ length: moteCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.25 + Math.random() * 0.75,
      r: 1.1 + Math.random() * 2.6,
      drift: -0.05 - Math.random() * 0.12,
    }));

    const streaks = Array.from({ length: streakCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 42 + Math.random() * 120,
      w: 1.1 + Math.random() * 2.2,
      speed: 0.004 + Math.random() * 0.009,
      angle: -0.55 - Math.random() * 0.35,
      alpha: 0.32 + Math.random() * 0.48,
    }));

    const sparks = Array.from({ length: sparkCount }, () => ({
      orbit: 0.12 + Math.random() * 0.28,
      speed: 0.008 + Math.random() * 0.018,
      phase: Math.random() * Math.PI * 2,
      size: 1.2 + Math.random() * 2.2,
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
      applyMotion();
      if (document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, width, height);

      for (const streak of streaks) {
        streak.x += Math.cos(streak.angle) * streak.speed;
        streak.y += Math.sin(streak.angle) * streak.speed * 0.72;
        if (streak.x < -0.12 || streak.x > 1.12 || streak.y < -0.12 || streak.y > 1.12) {
          streak.x = Math.random();
          streak.y = Math.random() > 0.5 ? -0.08 : 1.08;
        }
        const sx = streak.x * width;
        const sy = streak.y * height;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(streak.angle);
        const glow = ctx.createLinearGradient(-streak.len, 0, streak.len, 0);
        glow.addColorStop(0, "rgba(224, 197, 122, 0)");
        glow.addColorStop(0.5, `rgba(243, 230, 195, ${streak.alpha})`);
        glow.addColorStop(1, "rgba(224, 197, 122, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(-streak.len, -streak.w, streak.len * 2, streak.w * 2);
        ctx.restore();
      }

      for (const mote of motes) {
        mote.y += mote.drift * 0.012;
        mote.x += Math.sin(tick * 0.006 + mote.z * 9) * 0.00055;
        if (mote.y < -0.03) {
          mote.y = 1.03;
          mote.x = Math.random();
        }
        const px = mote.x * width;
        const py = mote.y * height;
        const radius = mote.r * (0.85 + mote.z);
        const alpha = 0.28 + mote.z * 0.58;
        ctx.beginPath();
        ctx.fillStyle = `rgba(243, 230, 195, ${alpha})`;
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const cx = width * (0.5 + pointer.x * 0.06);
      const cy = height * (0.44 + pointer.y * -0.04);
      for (const spark of sparks) {
        const ang = spark.phase + tick * spark.speed;
        const sx = cx + Math.cos(ang) * spark.orbit * width;
        const sy = cy + Math.sin(ang) * spark.orbit * height * 0.72;
        ctx.beginPath();
        ctx.fillStyle = "rgba(243, 230, 195, 0.72)";
        ctx.shadowColor = "rgba(196, 163, 90, 0.85)";
        ctx.shadowBlur = 12;
        ctx.arc(sx, sy, spark.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      tick += 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      stopShader?.();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section ref={stage} className="landing-hero" aria-label={headline}>
      <canvas ref={field} className="landing-field" aria-hidden="true" />
      <canvas ref={canvas} className="landing-particles" aria-hidden="true" />
      <div className="landing-bloom" aria-hidden="true" />
      <div className="landing-flare" aria-hidden="true" />
      <div className="landing-beams" aria-hidden="true" />
      <span className="landing-streak landing-streak-a" aria-hidden="true" />
      <span className="landing-streak landing-streak-b" aria-hidden="true" />
      <span className="landing-streak landing-streak-c" aria-hidden="true" />
      <div className="landing-horizon" aria-hidden="true" />
      <div className="landing-chamber" aria-hidden="true">
        <span className="landing-halo landing-halo-a" />
        <span className="landing-halo landing-halo-b" />
        <span className="landing-vault" />
        <span className="landing-column landing-column-a" />
        <span className="landing-column landing-column-b" />
        <span className="landing-doc landing-doc-a" />
        <span className="landing-doc landing-doc-b" />
        <span className="landing-doc landing-doc-c" />
        <span className="landing-doc landing-doc-d" />
        <span className="landing-ring landing-ring-a" />
        <span className="landing-ring landing-ring-b" />
        <span className="landing-ring landing-ring-c" />
        <span className="landing-ring landing-ring-d" />
        <span className="landing-ring landing-ring-e" />
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
