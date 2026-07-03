import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        variables: {
          colorBackground: "#15130f",
          colorInputBackground: "#1c1a16",
          colorInputText: "#e8e2d4",
          colorText: "#e8e2d4",
          colorTextSecondary: "#9c958a",
          colorPrimary: "#c9a04d",
          colorDanger: "#ef4444",
          borderRadius: "0.75rem",
          fontFamily: "Inter, system-ui, sans-serif",
        },
        elements: {
          card: "bg-transparent shadow-none border-0",
          rootBox: "w-full",
        },
      }}
    />
  );
}
