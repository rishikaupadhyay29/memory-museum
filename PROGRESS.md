# Memory Museum — Build Progress

**Last updated:** Sprint 1, mid-implementation  
**Architecture status:** Finalised and approved — do not redesign  
**Codebase status:** Active engineering phase

---

## Project Overview

Memory Museum is an immersive full-stack 3D web application where users walk through curated exhibits of their personal memories. Built with Next.js 14, React Three Fiber, Clerk, Prisma + Supabase, Zustand, TanStack Query, GSAP, and Framer Motion.

---

## Approved Build Order

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Core Museum Foundation | 🟡 In Progress |
| **Phase 2** | Progression + Construction System | ⬜ Not Started |
| **Phase 3** | Emotion Classification + Dynamic Weather | ⬜ Not Started |
| **Phase 4** | AI Curator | ⬜ Not Started |
| **Phase 5** | Intelligent Exhibit Creation + Music Selection | ⬜ Not Started |
| **Phase 6** | Hidden Rooms | ⬜ Not Started |
| **Phase 7** | Living Audio + Cinematic Detail Layer | ⬜ Not Started |
| **Phase 8** | Future Dreams Wing | ⬜ Not Started |
| **Phase 9** | Memory Constellation | ⬜ Not Started |
| **Phase 10** | AI Story Movie | ⬜ Not Started |

---

## Phase 1 — Core Museum Foundation

### ✅ Completed

#### Project Configuration
- `package.json` — all dependencies declared (Next.js 14, R3F, Clerk, Prisma, Zustand, TanStack Query, GSAP, Framer Motion, Lenis, Zod, Supabase, OpenAI, svix, postprocessing)
- `tsconfig.json` — strict TypeScript with path aliases (`@/*`)
- `tailwind.config.ts` — museum design tokens, custom animations, glassmorphism utilities
- `postcss.config.js`
- `.eslintrc.json` — TypeScript-aware rules
- `.prettierrc`
- `.gitignore`
- `next.config.ts` — standalone output, GLTF/KTX2 asset handling, image domains
- `Dockerfile` — multi-stage production build
- `docker-compose.yml` — app + PostgreSQL (pgvector) + Redis

#### Design System
- `styles/tokens.css` — all CSS custom properties (colors, typography, spacing, radii, shadows, animation easings, z-index scale)
- `app/globals.css` — Tailwind base + glassmorphism utilities (`.glass`, `.glass-lighter`, `.glass-hover`), gold gradient text, shimmer, magnetic button base, HUD overlay helpers, all keyframe animations

#### Database
- `prisma/schema.prisma` — complete Phase 1 schema:
  - `User` (Clerk sync, storage tracking)
  - `Wing` (museum sections)
  - `Exhibit` (memory groupings with theme enum)
  - `Memory` (photos, videos, journals, audio, locations)
  - `Person` + `MemoryPerson` (people tagging)
  - `UploadJob` (async processing pipeline)
  - All enums: `MemoryType`, `UploadJobStatus`, `ExhibitTheme`
  - All indexes for query performance

#### Authentication
- `middleware.ts` — Clerk auth middleware protecting all museum routes, allowing public/webhook routes
- `app/(auth)/layout.tsx` — centered dark auth wrapper with museum branding
- `app/(auth)/sign-in/[[...rest]]/page.tsx` — Clerk SignIn with museum dark theme
- `app/(auth)/sign-up/[[...rest]]/page.tsx` — Clerk SignUp with museum dark theme
- `app/api/webhooks/clerk/route.ts` — handles `user.created`, `user.updated`, `user.deleted` with svix signature verification, upserts to DB

#### Library Layer (`lib/`)
- `lib/prisma.ts` — singleton Prisma client (dev hot-reload safe)
- `lib/redis.ts` — singleton Redis client + `checkRateLimit()` token bucket helper
- `lib/supabase.ts` — browser client (anon key) + server admin client (service role) + `createSignedUploadUrl()` + `getPublicMediaUrl()`
- `lib/openai.ts` — OpenAI singleton + `AI_MODELS` constants
- `lib/auth.ts` — `requireAuth()`, `getAuthUser()`, `syncClerkUser()`, `assertOwnership()`
- `lib/utils.ts` — `cn()`, `formatBytes()`, `formatRelativeDate()`, `clamp()`, `lerp()`, `mapRange()`, `slugify()`, `debounce()`, `randomRange()`, `isBrowser`, `isTouchDevice()`
- `lib/validators/index.ts` — all Zod schemas: `CreateMemorySchema`, `UpdateMemorySchema`, `CreateExhibitSchema`, `UpdateExhibitSchema`, `CreateWingSchema`, `RequestUploadUrlSchema`, `CreatePersonSchema`, `PaginationSchema`, `MemoryListQuerySchema` + `apiSuccess()`/`apiError()` response helpers

#### AI Provider Architecture
- `lib/ai/types.ts` — complete `IAIProvider` interface with all method signatures: `captionImage`, `transcribeAudio`, `embedText`, `clusterMemories`, `generateExhibitNarrative`, `selectMusic`, `generateCuratorGreeting`, `generateCuratorRecommendation`, `classifyEmotion`, `generateMovieStructure`; all input/output types
- `lib/ai/MockAIProvider.ts` — fully functional mock: realistic delays, deterministic embeddings, varied captions/narratives/greetings, all 10 IAIProvider methods implemented
- `lib/ai/registry.ts` — `getAIProvider()` singleton factory, `setAIProvider()` for testing, `resetAIProvider()` for teardown; auto-selects Mock vs real based on env

#### Performance Foundation
- `lib/performance.ts` — `QualityTier` type, `QualitySettings` interface, `QUALITY_PRESETS` (low/medium/high with particle counts, shadow resolution, DOF, bloom, texture scale, far plane, AA samples), `detectQualityTier()` (deviceMemory + hardwareConcurrency + UA + WebGL renderer string heuristics + localStorage override), `setQualityTierOverride()`, `FPSMonitor` class (rolling 60-frame average, drop callback)

#### State Management
- `store/museumStore.ts` — Zustand store with `subscribeWithSelector`: scene navigation state (`activeScene`, `activeWingId`, `activeExhibitId`, `isTransitioning`), camera state (`cameraTarget`, `cameraMode`, `isCameraLocked`), environment (`audioEnabled`, `ambientVolume`), performance (`qualityTier`, `qualitySettings`, `frameloop`), UI state (`isMapOpen`, `isExhibitPanelOpen`, `focusedObjectId`); all navigation actions (`navigateToLobby`, `navigateToWing`, `navigateToExhibit`, `navigateToConstellation`, `navigateToHiddenRoom`)
- `store/uploadStore.ts` — per-file upload queue with `UploadFile` type, `addFiles()`, `updateFileStatus()`, `removeFile()`, `clearCompleted()`, object URL lifecycle management

#### Providers
- `components/providers/QueryProvider.tsx` — TanStack Query with museum-appropriate defaults (no refetch on window focus)
- `components/providers/LenisProvider.tsx` — smooth scroll, auto-disabled on `/museum/*` routes

#### Root Layout
- `app/layout.tsx` — Cormorant Garamond (display) + Inter (body) via `next/font`, ClerkProvider wrapping QueryProvider wrapping LenisProvider, full metadata + viewport config

#### API Routes
- `app/api/health/route.ts` — DB connectivity check
- `app/api/webhooks/clerk/route.ts` — user sync (see Authentication above)

#### UI Primitive System
- `components/ui/primitives/Button.tsx` — CVA variants (gold, glass, ghost, danger, outline), sizes (sm/md/lg/icon/icon-sm), magnetic hover effect, loading spinner, forwardRef
- `components/ui/primitives/GlassPanel.tsx` — CVA variants for padding, glow, interactive states
- `components/ui/primitives/Badge.tsx` — gold/mist/success/warning/danger variants
- `components/ui/primitives/index.ts` — barrel export

#### Three.js Engine Foundation
- `components/three/loaders/SuspenseFallback.tsx` — museum-branded loading spinner (uses R3F Html)
- `components/three/loaders/AssetPreloader.tsx` — KTX2Loader + DRACOLoader + MeshoptDecoder setup, runs once inside Canvas context
- `components/three/effects/PostProcessing.tsx` — Bloom + DepthOfField + Vignette, quality-gated from museumStore, tighter DOF in exhibit mode
- `components/three/controls/CameraRig.tsx` — GSAP-driven camera transitions to `cameraTarget`, smooth look-at interpolation via `useFrame`, OrbitControls fallback, frameloop management
- `components/three/scenes/LobbyScene.tsx` — full entrance hall: reflective marble floor (`MeshReflectorMaterial`), architectural columns with gold capitals, arched doorway, instanced dust mote particles, volumetric lighting, fog, Environment map
- `components/three/scenes/WingScene.tsx` — exhibit hall with interactive pedestals (focus/click → store), 3×2 pedestal grid, animated glow lights, wall sconces
- `components/three/scenes/ExhibitScene.tsx` — intimate exhibit room: 3 floating photo frames (breathing animation), spotlight on main frame, pedestal placard
- `components/three/scenes/SceneManager.tsx` — reads museumStore, renders correct scene inside Suspense boundary; never remounts Canvas between navigations

#### Museum Shell
- `components/museum/CanvasRoot.tsx` — single R3F `<Canvas>`, imports SceneManager + CameraRig + PostProcessing + AssetPreloader, adaptive DPR, quality-aware GL settings
- `components/museum/AudioToggle.tsx` — HUD audio on/off button with Framer Motion entrance
- `components/museum/ExhibitInfoPanel.tsx` — slide-up glassmorphic panel on exhibit focus/entry
- `components/museum/MuseumHUD.tsx` — full DOM overlay: top-left breadcrumb, top-right map+audio, bottom-right exhibit panel, transition veil (AnimatePresence)
- `components/museum/MuseumShell.tsx` — dynamic imports CanvasRoot (ssr:false), route→store sync hook (`useRouteSync` parses pathname → fires navigation actions), quality tier init hook, composes CanvasRoot + MuseumHUD

#### Navigation Components
- `components/ui/navigation/BreadcrumbCompass.tsx` — animated breadcrumb, clickable lobby link, transition-aware opacity
- `components/ui/navigation/MuseumMap.tsx` — toggleable SVG minimap with wing nodes + connection lines, active wing highlighting, click-to-navigate

---

### 🟡 Remaining in Phase 1

#### App Routes (museum)
- [ ] `app/(museum)/layout.tsx` — server layout that mounts MuseumShell
- [ ] `app/(museum)/museum/page.tsx` — lobby page (thin; all visuals in 3D)
- [ ] `app/(museum)/museum/[wingId]/page.tsx` — wing page
- [ ] `app/(museum)/museum/[wingId]/[exhibitId]/page.tsx` — exhibit page

#### Marketing
- [ ] `app/(marketing)/layout.tsx`
- [ ] `app/(marketing)/page.tsx` — cinematic landing page

#### Hooks
- [ ] `hooks/useMuseumNavigation.ts` — navigation helpers + history
- [ ] `hooks/useScrollProgress.ts` — scroll depth tracker for marketing routes
- [ ] `hooks/useExhibitLoader.ts` — TanStack Query wrapper for exhibit data

#### UI Transitions
- [ ] `components/ui/transitions/PageTransition.tsx`
- [ ] `components/ui/transitions/CurtainReveal.tsx`

#### API Routes
- [ ] `app/api/memories/route.ts` — GET list + POST create
- [ ] `app/api/memories/[id]/route.ts` — GET + PATCH + DELETE
- [ ] `app/api/exhibits/route.ts` — GET list + POST create
- [ ] `app/api/exhibits/[id]/route.ts` — GET + PATCH + DELETE
- [ ] `app/api/upload/route.ts` — signed URL generation

#### Barrel Exports
- [ ] `components/ui/navigation/index.ts`
- [ ] `components/ui/transitions/index.ts`
- [ ] `components/museum/index.ts`

---

## Phases 2–10 (Post Core Museum)

All detailed in the approved architecture document. Key items:

**Phase 2 — Progression + Construction**
- `ProgressionState` + `ConstructionEvent` DB tables
- Declarative rules engine (`lib/progression/rules.ts`)
- Construction animation components (WallRise, PillarAssemble, StatueAppear, etc.)
- `ConstructionManager` inside Canvas

**Phase 3 — Emotion + Weather**
- `Memory.emotion` field + emotion classification pipeline
- `WeatherController` component
- Weather presets: Happy, Peaceful, Achievement, Sad, Childhood, Night

**Phase 4 — AI Curator**
- `CuratorCharacter.tsx` — rigged 3D character with navmesh pathfinding
- `CuratorDialogueBubble.tsx` — cinematic subtitle (never a chat window)
- Session-aware greeting/recommendation generation
- `CuratorMemoryLog` DB table

**Phase 5 — Intelligent Exhibit Creation + Music**
- Upload → cluster → suggest flow in UI
- Music selection from `SoundtrackAsset` table (curated library, no generative audio)
- Full AI caption/narrative auto-generation on publish

**Phase 6 — Hidden Rooms**
- 6 rooms with declarative unlock criteria
- Reuses construction event pipeline for discovery animation

**Phase 7 — Living Audio + Cinematic Details**
- `AmbienceController` with crossfade between wing audio beds
- Dust motes, curtain sway, candle flicker, bird flocks, water reflections

**Phase 8 — Future Dreams Wing**
- `FutureDream` DB table
- Vision board upload + AI visualization
- Dream→Memory graduation flow

**Phase 9 — Memory Constellation**
- Galaxy view with instanced `THREE.InstancedMesh` stars
- Web Worker force-directed layout from embedding vectors
- `ConnectionBeam` animated light lines
- LOD: cluster sprites at distance, individual stars on zoom

**Phase 10 — AI Story Movie**
- Async Remotion/ffmpeg render worker (separate Docker service)
- Chapter assembly from exhibit narratives
- TTS narration + soundtrack selection
- `StoryMovie` DB table, status polling

---

## Engineering Rules (Reference)

- Never regenerate or redesign the architecture
- Every response extends the existing codebase — never replaces
- Every file must compile with no placeholders or TODO comments
- Stop at logical checkpoints between responses
- Production-quality TypeScript throughout
- AI music = selection from pre-licensed library (no generative audio anywhere)

---

## Key Architectural Decisions (Locked)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Single Canvas | Persistent across all `/museum/*` routes | Prevents WebGL context destroy/recreate on navigation |
| Route→Store sync | `usePathname()` in MuseumShell fires Zustand actions | Decouples Next.js routing from 3D scene management |
| Scene swapping | Internal to Canvas via SceneManager | Camera transitions feel cinematic, not page-load-like |
| AI music | Curated library selection, not generative | Cost, reliability, and licensing |
| Quality tier | Detected on mount, stored in Zustand + localStorage | Graceful degradation without user friction |
| Frameloop | `"demand"` default, `"always"` during animation | Battery/GPU efficiency in idle states |

---

## How to Resume

Next response should begin with:

```
app/(museum)/layout.tsx
```

Then continue through the remaining Phase 1 checklist in order. Do not re-examine architecture or re-plan — continue directly from the checklist above.
