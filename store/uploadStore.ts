import { create } from "zustand";

export type UploadStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "transcribing"
  | "captioning"
  | "done"
  | "error";

export interface UploadFile {
  id: string;
  file: File;
  memoryType: "PHOTO" | "VIDEO" | "JOURNAL" | "AUDIO" | "LOCATION";
  status: UploadStatus;
  progress: number; // 0–100
  error: string | null;
  memoryId: string | null;        // set once the DB row is created
  uploadJobId: string | null;     // set once the processing job is queued
  previewUrl: string | null;      // local object URL for UI preview
}

interface UploadState {
  files: UploadFile[];
  isDrawerOpen: boolean;
  activeUploadCount: number;

  // ── Actions ─────────────────────────────────────────────────────────────
  addFiles: (files: File[], memoryType: UploadFile["memoryType"]) => void;
  updateFileStatus: (
    id: string,
    patch: Partial<Pick<UploadFile, "status" | "progress" | "error" | "memoryId" | "uploadJobId">>
  ) => void;
  removeFile: (id: string) => void;
  clearCompleted: () => void;
  setDrawerOpen: (open: boolean) => void;
}

let idCounter = 0;
function nextId(): string {
  return `upload_${Date.now()}_${++idCounter}`;
}

function inferMemoryType(file: File): UploadFile["memoryType"] {
  if (file.type.startsWith("image/")) return "PHOTO";
  if (file.type.startsWith("video/")) return "VIDEO";
  if (file.type.startsWith("audio/")) return "AUDIO";
  if (file.type === "text/plain" || file.type === "application/pdf") return "JOURNAL";
  return "PHOTO";
}

export const useUploadStore = create<UploadState>((set) => ({
  files: [],
  isDrawerOpen: false,
  activeUploadCount: 0,

  addFiles: (files, memoryType) => {
    const newFiles: UploadFile[] = files.map((file) => ({
      id: nextId(),
      file,
      memoryType: memoryType ?? inferMemoryType(file),
      status: "pending",
      progress: 0,
      error: null,
      memoryId: null,
      uploadJobId: null,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));

    set((state) => ({
      files: [...state.files, ...newFiles],
      isDrawerOpen: true,
      activeUploadCount: state.activeUploadCount + newFiles.length,
    }));
  },

  updateFileStatus: (id, patch) => {
    set((state) => {
      const files = state.files.map((f) => (f.id === id ? { ...f, ...patch } : f));
      const activeUploadCount = files.filter(
        (f) => f.status !== "done" && f.status !== "error"
      ).length;
      return { files, activeUploadCount };
    });
  },

  removeFile: (id) => {
    set((state) => {
      const file = state.files.find((f) => f.id === id);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);

      const files = state.files.filter((f) => f.id !== id);
      const activeUploadCount = files.filter(
        (f) => f.status !== "done" && f.status !== "error"
      ).length;
      return { files, activeUploadCount };
    });
  },

  clearCompleted: () => {
    set((state) => {
      state.files
        .filter((f) => f.status === "done" || f.status === "error")
        .forEach((f) => {
          if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
        });

      const files = state.files.filter(
        (f) => f.status !== "done" && f.status !== "error"
      );
      return { files, activeUploadCount: files.length };
    });
  },

  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
}));
