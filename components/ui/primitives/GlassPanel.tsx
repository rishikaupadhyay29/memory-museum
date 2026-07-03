import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassPanelVariants = cva(
  ["glass rounded-museum border-gold", "transition-all duration-300"],
  {
    variants: {
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      glow: {
        none: "",
        subtle: "hover:shadow-[var(--shadow-gold-sm)]",
        gold: "shadow-[var(--shadow-gold)]",
      },
      interactive: {
        true: "glass-hover cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      padding: "md",
      glow: "none",
      interactive: false,
    },
  }
);

interface GlassPanelProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassPanelVariants> {}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, padding, glow, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassPanelVariants({ padding, glow, interactive }), className)}
      {...props}
    />
  )
);

GlassPanel.displayName = "GlassPanel";
