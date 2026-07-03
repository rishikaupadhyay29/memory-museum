"use client";

import { forwardRef, useRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles shared by all variants
  [
    "relative inline-flex items-center justify-center gap-2",
    "font-body text-sm font-medium",
    "transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-museum-gold/60",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    "select-none",
  ],
  {
    variants: {
      variant: {
        gold: [
          "bg-museum-gold text-museum-obsidian",
          "hover:bg-museum-gold-light hover:shadow-gold",
          "active:scale-[0.98]",
        ],
        glass: [
          "glass border-gold text-museum-marble",
          "hover:border-gold-bright hover:bg-white/5",
          "active:scale-[0.98]",
        ],
        ghost: [
          "bg-transparent text-museum-mist",
          "hover:text-museum-marble hover:bg-white/5",
          "active:scale-[0.98]",
        ],
        danger: [
          "bg-red-900/30 text-red-400 border border-red-800/50",
          "hover:bg-red-900/50 hover:border-red-700/60",
        ],
        outline: [
          "bg-transparent border border-museum-gold/30 text-museum-marble",
          "hover:border-museum-gold/60 hover:text-museum-gold-light",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-5 rounded-lg",
        lg: "h-12 px-7 text-base rounded-xl",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render a loading spinner and disable the button */
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    const innerRef = useRef<HTMLButtonElement>(null);

    // Magnetic hover effect
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = (ref as React.RefObject<HTMLButtonElement>)?.current ?? innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = (ref as React.RefObject<HTMLButtonElement>)?.current ?? innerRef.current;
      if (el) el.style.transform = "";
      props.onMouseLeave?.(e);
    };

    return (
      <button
        ref={ref ?? innerRef}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? isLoading}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
