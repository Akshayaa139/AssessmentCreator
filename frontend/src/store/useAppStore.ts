import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Exam, GenerationConfig } from "../types";

type AppView =
  | "dashboard"
  | "create"
  | "history"
  | "groups"
  | "library"
  | "settings";

interface AppState {
  user: { name: string; email: string } | null;
  config: GenerationConfig;
  currentExam: Exam | null;
  exams: Exam[];
  currentView: AppView;
  generationProgress: {
    status: string;
    percentage: number;
  } | null;
  isGenerating: boolean;

  login: (name: string, email: string) => void;
  logout: () => void;
  setConfig: (config: Partial<GenerationConfig>) => void;
  setExam: (exam: Exam | null) => void;
  addExam: (exam: Exam) => void;
  deleteExam: (id: string) => void;
  setView: (view: AppView) => void;
  setProgress: (
    progress: { status: string; percentage: number } | null,
  ) => void;
  setGenerating: (isGenerating: boolean) => void;
  resetConfig: () => void;
  loadExams: (ownerEmail?: string) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      config: {
        topic: "",
        grade: "",
        subject: "",
        duration: "60 mins",
        dueDate: "",
        difficulty: "medium",
        markWeightage: 2,
        questionTypes: [],
        questionPatterns: [
          { type: "Multiple Choice Questions", count: 10, marks: 1 },
          { type: "Short Answer Questions", count: 5, marks: 2 },
        ],
      },
      currentExam: null,
      exams: [],
      currentView: "dashboard",
      generationProgress: null,
      isGenerating: false,

      login: (name, email) =>
        set({ user: { name, email }, currentView: "dashboard" }),
      logout: () =>
        set({
          user: null,
          currentView: "dashboard",
          exams: [],
          currentExam: null,
        }),
      setConfig: (updates) =>
        set((state) => ({
          config: { ...state.config, ...updates },
        })),
      setExam: (exam) => set({ currentExam: exam }),
      addExam: (exam) =>
        set((state) => ({
          exams: [exam, ...state.exams],
          currentExam: exam,
        })),
      deleteExam: (id) =>
        set((state) => ({
          exams: state.exams.filter((e) => e.id !== id),
        })),
      setView: (view) => set({ currentView: view, currentExam: null }),
      setProgress: (progress) => set({ generationProgress: progress }),
      setGenerating: (isGenerating) => set({ isGenerating }),
      resetConfig: () =>
        set({
          config: {
            topic: "",
            grade: "",
            subject: "",
            duration: "60 mins",
            dueDate: "",
            difficulty: "medium",
            markWeightage: 2,
            questionTypes: [],
            questionPatterns: [
              { type: "Multiple Choice Questions", count: 10, marks: 1 },
              { type: "Short Answer Questions", count: 5, marks: 2 },
            ],
          },
        }),
      loadExams: async (ownerEmail?: string) => {
        try {
          if (!ownerEmail) {
            // Do not fetch global exams to avoid exposing other users' data
            set({ exams: [] });
            return;
          }

          const response = await fetch(
            `http://localhost:3001/exams?owner=${encodeURIComponent(ownerEmail)}`,
          );
          const data = await response.json();
          set({ exams: data });
        } catch (error) {
          console.error("Failed to load exams:", error);
        }
      },
    }),
    {
      name: "veda-ai-storage",
      partialize: (state) => ({
        user: state.user,
        config: state.config,
      }),
    },
  ),
);
