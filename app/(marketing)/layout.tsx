import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/primitives/Button";

function MarketingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4">
      <nav className="max-w-5xl mx-auto flex items-center justify-between glass border-gold rounded-museum px-5 py-3">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-lg text-museum-marble hover:text-museum-gold transition-colors duration-200"
        >
          Memory Museum
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="gold" size="sm">
                Begin
              </Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <Link href="/museum">
              <Button variant="gold" size="sm">
                Enter museum
              </Button>
            </Link>
            <UserButton
              appearance={{
                variables: { colorPrimary: "#c9a04d" },
                elements: { avatarBox: "w-8 h-8" },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-museum-obsidian">
      <MarketingNav />
      {children}
      <footer className="border-t border-museum-gold/10 py-8 px-6 text-center">
        <p className="text-xs text-museum-mist/40 font-body tracking-wide">
          © {new Date().getFullYear()} Memory Museum. Your memories, beautifully preserved.
        </p>
      </footer>
    </div>
  );
}
