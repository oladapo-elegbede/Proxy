// lib/state/session-store.ts

import { create } from "zustand";
import type {
  StudentSession,
  EmotionalMode,
  LanguageMode,
  Artifact,
  PendingThread,
  IntakeViewState,
  StreamingState,
  ToastMessage,
} from "@/lib/types";

interface SessionStore {
  // Data
  session: StudentSession | null;
  emotionalMode: EmotionalMode;
  languageMode: LanguageMode;

  // UI state
  intakeViewState: IntakeViewState;
  streamingState: StreamingState;
  toasts: ToastMessage[];

  // Actions
  setSession: (session: StudentSession) => void;
  setEmotionalMode: (mode: EmotionalMode) => void;
  setLanguageMode: (mode: LanguageMode) => void;
  setIntakeViewState: (state: IntakeViewState) => void;
  setStreamingState: (state: StreamingState) => void;
  completeNode: (nodeId: string) => void;
  addArtifact: (artifact: Artifact) => void;
  addPendingThread: (thread: PendingThread) => void;
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
  clearSession: () => void;
}

const DEFAULT_STREAMING_STATE: StreamingState = {
  isStreaming: false,
  partialContent: "",
  isComplete: false,
};

export const useSessionStore = create<SessionStore>((set) => ({
  // Initial state
  session: null,
  emotionalMode: "CALM",
  languageMode: "PLAIN",
  intakeViewState: "IDLE",
  streamingState: DEFAULT_STREAMING_STATE,
  toasts: [],

  // Actions
  setSession: (session) => set({ session }),

  setEmotionalMode: (emotionalMode) => set({ emotionalMode }),

  setLanguageMode: (languageMode) => set({ languageMode }),

  setIntakeViewState: (intakeViewState) => set({ intakeViewState }),

  setStreamingState: (streamingState) => set({ streamingState }),

  completeNode: (nodeId) =>
    set((state) => {
      if (!state.session) return state;

      const updatedNodes = state.session.pathway.nodes.map((node) => {
        if (node.id === nodeId) return { ...node, status: "COMPLETED" as const };
        return node;
      });

      // Find next FUTURE node and make it ACTIVE
      const nextNode = updatedNodes.find((n) => n.status === "FUTURE");
      if (nextNode) nextNode.status = "ACTIVE";

      const activeNodeId = nextNode?.id ?? nodeId;

      return {
        session: {
          ...state.session,
          pathway: { ...state.session.pathway, nodes: updatedNodes, activeNodeId },
          position: {
            ...state.session.position,
            activeNodeId,
            completedNodeIds: [
              ...state.session.position.completedNodeIds,
              nodeId,
            ],
          },
        },
      };
    }),

  addArtifact: (artifact) =>
    set((state) => {
      if (!state.session) return state;
      return {
        session: {
          ...state.session,
          artifacts: [...state.session.artifacts, artifact],
        },
      };
    }),

  addPendingThread: (thread) =>
    set((state) => {
      if (!state.session) return state;
      return {
        session: {
          ...state.session,
          pendingThreads: [...state.session.pendingThreads, thread],
        },
      };
    }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).slice(2) },
      ],
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearSession: () =>
    set({
      session: null,
      emotionalMode: "CALM",
      languageMode: "PLAIN",
      intakeViewState: "IDLE",
      streamingState: DEFAULT_STREAMING_STATE,
      toasts: [],
    }),
}));