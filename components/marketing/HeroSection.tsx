"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/primitives/Button";

// ── Ambient particle field ────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function AmbientParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        duration: 6 + Math.random() * 12,
        delay: Math.random() * 8,
        opacity: 0.15 + Math.random() * 0.45,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-museum-gold"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Animated display title ────────────────────────────────────────────────────

const TITLE_WORDS = ["Memory", "Museum"];

function AnimatedTitle() {
  return (
    <div className="overflow-hidden">
      {TITLE_WORDS.map((word, wi) => (
        <div key={word} className="overflow-hidden block">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1.1,
              delay: 0.3 + wi * 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="block font-display text-[clamp(3.5rem,10vw,8.5rem)] leading-none tracking-tight"
          >
            <span className={wi === 0 ? "text-museum-marble" : "text-gold-gradient"}>{word}</span>
          </motion.span>
        </div>
      ))}
    </div>
  );
}

// ── Scroll indicator ──────────────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4, duration: 0.8 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      aria-hidden
    >
      <span className="text-label" style={{ fontSize: "0.65rem" }}>
        Explore
      </span>
      <div className="w-px h-12 bg-gradient-to-b from-museum-gold/50 to-transparent animate-pulse" />
    </motion.div>
  );
}

// ── Feature cards ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    number: "01",
    title: "Walk through your life",
    body: "An immersive 3D museum built from your photos, videos, journals, and voice recordings. Every room a chapter.",
  },
  {
    number: "02",
    title: "A museum that grows with you",
    body: "Each memory you add constructs new wings. Walls rise, gardens bloom, and hidden rooms unlock as your collection deepens.",
  },
  {
    number: "03",
    title: "Your AI Curator",
    body: "A living character who walks the halls, surfaces forgotten memories, and weaves your moments into cinematic narratives.",
  },
] as const;

function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {FEATURES.map((f, i) => (
        <motion.div
          key={f.number}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="glass border-gold rounded-museum p-7 group hover:border-museum-gold/35 transition-all duration-500"
        >
          <p className="text-label mb-5">{f.number}</p>
          <h3 className="font-display text-xl text-museum-marble mb-3 leading-snug group-hover:text-gold-gradient transition-all duration-500">
            {f.title}
          </h3>
          <p className="text-sm text-museum-mist leading-relaxed font-body">{f.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main hero export ──────────────────────────────────────────────────────────

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], ["0%", "12%"]);

  return (
    <main ref={containerRef}>
      {/* ── Full-viewport hero ── */}
      <section className="relative min-h-dvh flex items-center justify-center overflow-hidden">
        {/* Radial gold glow — deep background */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(201,160,77,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Subtle vignette frame */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(10,9,8,0.9) 100%)",
          }}
        />

        {/* Floating ambient particles */}
        <AmbientParticles />

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          {/* Eyebrow label */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-label mb-8"
          >
            Your life, curated
          </motion.p>

          {/* Main title */}
          <AnimatedTitle />

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-px w-32 mx-auto my-8 bg-gradient-to-r from-transparent via-museum-gold/60 to-transparent"
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-lg md:text-xl text-museum-mist leading-relaxed max-w-xl mx-auto mb-12"
          >
            An immersive 3D museum where you walk through the most meaningful moments of your life —
            built, curated, and narrated by AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center flex-wrap gap-4"
          >
            <Link href="/sign-up">
              <Button variant="gold" size="lg" className="group min-w-44">
                Begin your museum
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="glass" size="lg" className="min-w-36">
                <Play className="w-3.5 h-3.5" />
                Sign in
              </Button>
            </Link>
          </motion.div>

          {/* Social proof whisper */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-8 text-xs text-museum-mist/40 font-body tracking-wide"
          >
            No credit card required · Your memories stay private
          </motion.p>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* ── Features section ── */}
      <section className="relative px-6 pb-32 pt-8 max-w-5xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <p className="text-label mb-4">What awaits inside</p>
          <h2 className="font-display text-4xl md:text-5xl text-museum-marble leading-tight">
            Not a gallery.
            <br />
            <span className="text-gold-gradient">A living world.</span>
          </h2>
        </motion.div>

        <FeatureCards />
      </section>

      {/* ── Final CTA band ── */}
      <section className="relative px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center glass border-gold rounded-museum p-12"
          style={{
            background:
              "radial-gradient(ellipse 120% 100% at 50% 100%, rgba(201,160,77,0.06) 0%, transparent 70%), var(--glass-bg)",
          }}
        >
          <p className="text-label mb-4">Ready to begin?</p>
          <h2 className="font-display text-3xl md:text-4xl text-museum-marble mb-4">
            Open the doors.
          </h2>
          <p className="text-museum-mist text-sm font-body mb-8 leading-relaxed">
            Your museum starts small — a single entrance hall. Upload your first memory and watch it
            come to life.
          </p>
          <Link href="/sign-up">
            <Button variant="gold" size="lg" className="group">
              Create your museum
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
