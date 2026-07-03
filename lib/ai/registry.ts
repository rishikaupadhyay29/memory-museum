import type { IAIProvider } from "./types";
import { MockAIProvider } from "./MockAIProvider";

type ProviderName = "mock" | "openai";

let _provider: IAIProvider | null = null;

/**
 * Get the currently active AI provider.
 * Defaults to MockAIProvider in development, OpenAIProvider in production
 * (once implemented in Phase 5 of the build order).
 *
 * The provider is a singleton — instantiated once and reused.
 */
export function getAIProvider(): IAIProvider {
  if (_provider) return _provider;

  const configured = (process.env.AI_PROVIDER as ProviderName | undefined) ?? "mock";
  const isProduction = process.env.NODE_ENV === "production";

  // In production, default to real OpenAI if key exists.
  // Falls back gracefully to mock if not yet configured.
  const useProvider: ProviderName =
    isProduction && process.env.OPENAI_API_KEY ? "openai" : configured;

  switch (useProvider) {
    case "openai": {
      // OpenAIProvider will be implemented in Phase 5 (AI pipeline).
      // Until then, even a production build without OPENAI_API_KEY uses mock.
      console.warn(
        "[AI Registry] OpenAIProvider not yet implemented — falling back to MockAIProvider"
      );
      _provider = new MockAIProvider();
      break;
    }
    default: {
      _provider = new MockAIProvider();
    }
  }

  return _provider;
}

/**
 * Override the active provider. Used in tests and when switching at runtime.
 */
export function setAIProvider(provider: IAIProvider): void {
  _provider = provider;
}

/**
 * Reset the provider to force re-initialization on next call.
 * Useful in test teardown.
 */
export function resetAIProvider(): void {
  _provider = null;
}
