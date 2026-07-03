import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-body text-xs font-medium px-2.5 py-0.5",
  {
    variants: {
      variant: {
        gold: "bg-museum-gold/15 text-museum-gold-light border border-museum-gold/25",
        mist: "bg-white/5 text-museum-mist border border-white/10",
        success: "bg-emerald-900/30 text-emerald-400 border border-emerald-800/40",
        warning: "bg-amber-900/30 text-amber-400 border border-amber-800/40",
        danger: "bg-red-900/30 text-red-400 border border-red-800/40",
      },
    },
    defaultVariants: {
      variant: "mist",
    },
  }
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
