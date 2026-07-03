import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRight, Upload, Images, DoorOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/primitives/Button";
import { GlassPanel } from "@/components/ui/primitives/GlassPanel";
import { Badge } from "@/components/ui/primitives/Badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Museum",
};

const STATS = [
  { label: "Memories", value: "0", icon: Images },
  { label: "Wings", value: "1", icon: Layers },
  { label: "Exhibits", value: "0", icon: DoorOpen },
] as const;

export default async function MuseumLobbyPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(201,160,77,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Decorative border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-8 border border-museum-gold/5 rounded-museum"
      />

      <div className="relative w-full max-w-xl flex flex-col items-center gap-8">
        <Badge variant="gold">Entrance Hall</Badge>

        <div className="text-center space-y-3">
          <h1 className="font-display text-[clamp(2.4rem,6vw,4rem)] text-museum-marble leading-tight">
            Welcome back, <span className="text-gold-gradient">{firstName}.</span>
          </h1>

          <p className="font-body text-museum-mist text-lg">Your museum is waiting.</p>
        </div>

        <div className="h-px w-24 bg-gradient-to-r from-transparent via-museum-gold/50 to-transparent" />

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="gold"
            size="lg"
            className="group flex-1 justify-center"
            disabled
            title="The 3D museum experience is coming soon"
          >
            <DoorOpen className="w-4 h-4" />
            Enter Museum
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>

          <Button
            variant="glass"
            size="lg"
            className="flex-1 justify-center"
            disabled
            title="Memory upload coming soon"
          >
            <Upload className="w-4 h-4" />
            Upload Memory
          </Button>
        </div>

        <GlassPanel padding="none" className="w-full">
          <div className="grid grid-cols-3 divide-x divide-museum-gold/10">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2 py-6 px-4">
                <Icon className="w-4 h-4 text-museum-gold/60" />
                <span className="font-display text-3xl text-museum-marble leading-none">
                  {value}
                </span>
                <span className="text-xs text-museum-mist font-body tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </GlassPanel>

        <p className="text-xs text-museum-mist/40 font-body text-center leading-relaxed max-w-xs">
          The full 3D museum experience is being constructed.{" "}
          <Link
            href="/"
            className="text-museum-gold/60 hover:text-museum-gold transition-colors underline underline-offset-2"
          >
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
