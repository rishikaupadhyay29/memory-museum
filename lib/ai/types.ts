/**
 * Memory Museum — AI Provider Abstraction Layer
 *
 * Every AI feature is expressed as a method on IAIProvider.
 * The real OpenAI implementation and the MockAIProvider both satisfy this interface,
 * allowing full feature development without requiring API keys in every environment.
 */

export interface CaptionResult {
  caption: string;
  confidence: number;
}

export interface TranscriptResult {
  transcript: string;
  durationSeconds: number;
}

export interface EmbeddingResult {
  vector: number[];
  model: string;
}

export interface ClusterSuggestion {
  suggestedTitle: string;
  suggestedDescription: string;
  memoryIds: string[];
  confidence: number;
  rationale: string;
}

export interface ExhibitNarrativeResult {
  narrative: string;
  title: string;
  description: string;
}

export interface MusicSelectionResult {
  trackId: string;
  trackName: string;
  mood: string;
  rationale: string;
}

export interface CuratorGreetingResult {
  text: string;
  animationCue: "excited" | "reflective" | "welcoming" | "curious" | "gentle";
  audioUrl: string | null;
}

export interface CuratorRecommendationResult {
  text: string;
  actionType: "create_exhibit" | "visit_exhibit" | "upload_memories" | "explore_room";
  actionTargetId: string | null;
  animationCue: "excited" | "reflective" | "welcoming" | "curious" | "gentle";
}

export interface EmotionClassificationResult {
  emotion: "happy" | "peaceful" | "achievement" | "sad" | "childhood" | "nostalgic" | "neutral";
  confidence: number;
  weatherPreset: "happy" | "peaceful" | "achievement" | "sad" | "childhood" | "night" | "neutral";
}

export interface MovieChapter {
  title: string;
  narration: string;
  memoryIds: string[];
  transitionType: "fade" | "dissolve" | "slide" | "zoom";
  durationSeconds: number;
}

export interface MovieGenerationResult {
  title: string;
  chapters: MovieChapter[];
  openingTitle: string;
  closingCredits: string;
  totalDurationSeconds: number;
  suggestedMusicTrackId: string | null;
}

export interface MemoryClusterContext {
  memoryId: string;
  type: string;
  capturedAt: Date | null;
  locationName: string | null;
  aiCaption: string | null;
  caption: string | null;
  transcript: string | null;
}

export interface ExhibitNarrativeContext {
  title: string;
  memories: Array<{
    capturedAt: Date | null;
    locationName: string | null;
    aiCaption: string | null;
    caption: string | null;
    transcript: string | null;
  }>;
}

export interface CuratorContext {
  userDisplayName: string | null;
  daysSinceLastVisit: number;
  totalMemories: number;
  totalExhibits: number;
  progressionLevel: number;
  recentConstructionEvents: string[];
  forgottenMemoryCount: number;
}

/**
 * The core AI provider interface. All AI features are methods here.
 * Implementations: OpenAIProvider (production), MockAIProvider (development/testing).
 */
export interface IAIProvider {
  readonly name: string;

  /** Generate a descriptive caption for a photo or video frame. */
  captionImage(imageUrl: string): Promise<CaptionResult>;

  /** Transcribe audio or video content to text. */
  transcribeAudio(audioUrl: string): Promise<TranscriptResult>;

  /** Generate an embedding vector for semantic search and clustering. */
  embedText(text: string): Promise<EmbeddingResult>;

  /** Analyze a set of memories and suggest exhibit groupings. */
  clusterMemories(memories: MemoryClusterContext[]): Promise<ClusterSuggestion[]>;

  /** Generate title, description, and narrative for an exhibit. */
  generateExhibitNarrative(context: ExhibitNarrativeContext): Promise<ExhibitNarrativeResult>;

  /** Select appropriate background music for an exhibit based on emotion/mood. */
  selectMusic(emotion: string, wingType: string): Promise<MusicSelectionResult>;

  /** Generate a contextual curator greeting for the current session. */
  generateCuratorGreeting(context: CuratorContext): Promise<CuratorGreetingResult>;

  /** Generate a curator recommendation based on the user's current state. */
  generateCuratorRecommendation(context: CuratorContext): Promise<CuratorRecommendationResult>;

  /** Classify the emotional content of a memory from its caption/transcript. */
  classifyEmotion(text: string, imageUrl?: string): Promise<EmotionClassificationResult>;

  /** Generate a movie structure from a set of exhibits. */
  generateMovieStructure(
    exhibitIds: string[],
    context: ExhibitNarrativeContext[]
  ): Promise<MovieGenerationResult>;
}
