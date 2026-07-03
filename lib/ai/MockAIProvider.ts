import type {
  IAIProvider,
  CaptionResult,
  TranscriptResult,
  EmbeddingResult,
  ClusterSuggestion,
  ExhibitNarrativeResult,
  MusicSelectionResult,
  CuratorGreetingResult,
  CuratorRecommendationResult,
  EmotionClassificationResult,
  MovieGenerationResult,
  MemoryClusterContext,
  ExhibitNarrativeContext,
  CuratorContext,
} from "./types";

// Simulated latency so the UI can test loading states realistically.
async function simulateDelay(ms = 400): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_CAPTIONS = [
  "Golden afternoon light streams through the window, casting long shadows across the room.",
  "A candid moment of pure joy — laughter frozen in time.",
  "The quiet before the storm: everything still, the horizon glowing amber.",
  "Hands intertwined, a promise made without words.",
  "The old city unfolded at dusk, its spires lit like embers.",
  "A child's wonder — eyes wide, the whole world new.",
  "The sea stretched endlessly, and for a moment, so did we.",
  "Familiar faces around a familiar table, the warmth of belonging.",
];

const MOCK_NARRATIVES = [
  "This collection captures a chapter written in light and laughter — a season of becoming.",
  "Within these walls of memory live the hours that made you who you are today.",
  "Every image here is a love letter to a particular moment in time.",
  "These fragments tell a larger story: of growth, of connection, of a life fully lived.",
];

const MOCK_GREETING_LINES: Array<CuratorGreetingResult> = [
  {
    text: "Welcome back. Your museum has been waiting — new wings are almost ready to be unveiled.",
    animationCue: "welcoming",
    audioUrl: null,
  },
  {
    text: "Ah, there you are. I have been thinking — you have some wonderful memories that deserve their own room.",
    animationCue: "curious",
    audioUrl: null,
  },
  {
    text: "You have been away a while. So much has changed here since your last visit.",
    animationCue: "gentle",
    audioUrl: null,
  },
  {
    text: "Wonderful — you are here. I noticed something in your archives that I think you will love.",
    animationCue: "excited",
    audioUrl: null,
  },
];

export class MockAIProvider implements IAIProvider {
  readonly name = "MockAIProvider";

  async captionImage(_imageUrl: string): Promise<CaptionResult> {
    await simulateDelay(600);
    const caption = MOCK_CAPTIONS[Math.floor(Math.random() * MOCK_CAPTIONS.length)] ?? MOCK_CAPTIONS[0]!;
    return { caption, confidence: 0.87 + Math.random() * 0.1 };
  }

  async transcribeAudio(_audioUrl: string): Promise<TranscriptResult> {
    await simulateDelay(1200);
    return {
      transcript:
        "This is a mock transcription of the audio content. In production, Whisper will transcribe the actual audio.",
      durationSeconds: 45,
    };
  }

  async embedText(text: string): Promise<EmbeddingResult> {
    await simulateDelay(200);
    // Deterministic pseudo-embedding based on text length for consistent clustering.
    const seed = text.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const vector = Array.from({ length: 1536 }, (_, i) =>
      Math.sin(seed * (i + 1) * 0.001) * 0.5
    );
    return { vector, model: "mock-embedding-v1" };
  }

  async clusterMemories(memories: MemoryClusterContext[]): Promise<ClusterSuggestion[]> {
    await simulateDelay(800);
    if (memories.length < 3) return [];

    // Group into 1-2 mock clusters for testing.
    const half = Math.ceil(memories.length / 2);
    return [
      {
        suggestedTitle: "Summer Memories",
        suggestedDescription:
          "A curated collection of warm summer moments — light, laughter, and the feeling of time standing still.",
        memoryIds: memories.slice(0, half).map((m) => m.memoryId),
        confidence: 0.82,
        rationale: "These memories share similar timing and emotional content.",
      },
      ...(memories.length > 4
        ? [
            {
              suggestedTitle: "Quiet Moments",
              suggestedDescription:
                "The in-between hours — peaceful, unhurried, and quietly beautiful.",
              memoryIds: memories.slice(half).map((m) => m.memoryId),
              confidence: 0.74,
              rationale: "These memories share a reflective, peaceful tone.",
            },
          ]
        : []),
    ];
  }

  async generateExhibitNarrative(
    context: ExhibitNarrativeContext
  ): Promise<ExhibitNarrativeResult> {
    await simulateDelay(1000);
    const narrative =
      MOCK_NARRATIVES[Math.floor(Math.random() * MOCK_NARRATIVES.length)] ??
      MOCK_NARRATIVES[0]!;
    return {
      title: context.title,
      description: `A collection of ${context.memories.length} cherished memories.`,
      narrative,
    };
  }

  async selectMusic(emotion: string, wingType: string): Promise<MusicSelectionResult> {
    await simulateDelay(300);
    const moodMap: Record<string, { trackId: string; trackName: string }> = {
      happy: { trackId: "track_001", trackName: "Morning Light" },
      peaceful: { trackId: "track_002", trackName: "Drifting Calm" },
      achievement: { trackId: "track_003", trackName: "Golden Hour" },
      sad: { trackId: "track_004", trackName: "Rainy Season" },
      childhood: { trackId: "track_005", trackName: "Paper Cranes" },
      nostalgic: { trackId: "track_006", trackName: "The Long Way Home" },
      neutral: { trackId: "track_007", trackName: "Museum Hours" },
    };
    const track = moodMap[emotion] ?? moodMap["neutral"]!;
    return {
      ...track,
      mood: emotion,
      rationale: `Selected for ${wingType} wing with ${emotion} emotional tone.`,
    };
  }

  async generateCuratorGreeting(_context: CuratorContext): Promise<CuratorGreetingResult> {
    await simulateDelay(500);
    return (
      MOCK_GREETING_LINES[Math.floor(Math.random() * MOCK_GREETING_LINES.length)] ??
      MOCK_GREETING_LINES[0]!
    );
  }

  async generateCuratorRecommendation(
    context: CuratorContext
  ): Promise<CuratorRecommendationResult> {
    await simulateDelay(600);
    if (context.forgottenMemoryCount > 0) {
      return {
        text: `You have ${context.forgottenMemoryCount} memories that have never found a home in any exhibit. Shall we give them one?`,
        actionType: "create_exhibit",
        actionTargetId: null,
        animationCue: "curious",
      };
    }
    return {
      text: "Your collection is growing beautifully. Perhaps it is time to explore the newest wing?",
      actionType: "explore_room",
      actionTargetId: null,
      animationCue: "welcoming",
    };
  }

  async classifyEmotion(
    _text: string,
    _imageUrl?: string
  ): Promise<EmotionClassificationResult> {
    await simulateDelay(300);
    const emotions = [
      "happy",
      "peaceful",
      "achievement",
      "sad",
      "childhood",
      "nostalgic",
      "neutral",
    ] as const;
    const emotion = emotions[Math.floor(Math.random() * emotions.length)] ?? "neutral";
    const weatherMap: Record<string, EmotionClassificationResult["weatherPreset"]> = {
      happy: "happy",
      peaceful: "peaceful",
      achievement: "achievement",
      sad: "sad",
      childhood: "childhood",
      nostalgic: "peaceful",
      neutral: "neutral",
    };
    return {
      emotion,
      confidence: 0.7 + Math.random() * 0.25,
      weatherPreset: weatherMap[emotion] ?? "neutral",
    };
  }

  async generateMovieStructure(
    _exhibitIds: string[],
    contexts: ExhibitNarrativeContext[]
  ): Promise<MovieGenerationResult> {
    await simulateDelay(2000);
    const chapters = contexts.map((ctx, i) => ({
      title: ctx.title,
      narration: `Chapter ${i + 1}: ${MOCK_NARRATIVES[i % MOCK_NARRATIVES.length] ?? ""}`,
      memoryIds: ctx.memories.map((_, j) => `memory_${i}_${j}`),
      transitionType: (["fade", "dissolve", "slide", "zoom"] as const)[i % 4]!,
      durationSeconds: 12 + ctx.memories.length * 3,
    }));

    return {
      title: "My Story",
      chapters,
      openingTitle: "A life in moments",
      closingCredits: "Created with Memory Museum",
      totalDurationSeconds: chapters.reduce((acc, c) => acc + c.durationSeconds, 0),
      suggestedMusicTrackId: "track_007",
    };
  }
}
