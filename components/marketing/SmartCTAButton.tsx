"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/primitives/Button";
import { ArrowRight } from "lucide-react";

interface SmartCTAButtonProps {
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SmartCTAButton({ label, size = "lg", className }: SmartCTAButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  function handleClick() {
    if (!isLoaded) return;
    router.push(isSignedIn ? "/museum" : "/sign-up");
  }

  return (
    <Button
      variant="gold"
      size={size}
      onClick={handleClick}
      isLoading={!isLoaded}
      className={className}
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Button>
  );
}
