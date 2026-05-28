"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  FileText,
  Upload,
} from "lucide-react";

interface CreateAssignmentProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
  fileName: string | null;
}

const CreateAssignment: React.FC<CreateAssignmentProps> = ({
  onFileUpload,
  onGenerate,
  fileName,
}) => {
  const { config, setConfig, isGenerating, generationProgress, setView } =
    useAppStore();

  // Provide a stable fallback during hydration so inputs remain controlled
  const defaultConfig = {
    topic: "",
    grade: "",
    subject: "",
    duration: "60 mins",
    dueDate: "",
    difficulty: "medium",
    markWeightage: 2,
    questionTypes: [],
    questionPatterns: [],
    additionalInstructions: "",
  } as const;

  const cfg = { ...(defaultConfig as any), ...(config || {}) } as any;
  const router = useRouter();

  const goHome = () => {
    setView("dashboard");
    router.push("/");
  };

  const updatePattern = (index: number, updates: any) => {
    const patterns = config.questionPatterns || [];
    const newPatterns = [...patterns];
    newPatterns[index] = { ...newPatterns[index], ...updates };
    setConfig({ questionPatterns: newPatterns });
  };

  const addPattern = () => {
    const patterns = config.questionPatterns || [];
    setConfig({
      questionPatterns: [
        ...patterns,
        { type: "New Question Type", count: 5, marks: 1 },
      ],
    });
  };

  const removePattern = (index: number) => {
    const patterns = config.questionPatterns || [];
    setConfig({
      questionPatterns: patterns.filter((_, i) => i !== index),
    });
  };

  const totalQuestions = (config.questionPatterns || []).reduce(
    (sum, p) => sum + p.count,
    0,
  );
  const totalMarks = (config.questionPatterns || []).reduce(
    (sum, p) => sum + p.count * p.marks,
    0,
  );

  // Sanitize any backend-generated status messages that mention "AI" or vendor names.
  const sanitizedProgressStatus = (
    status?: { status: string; percentage: number } | null,
  ) => {
    if (!status || !status.status) return "Processing...";
    const s = status.status;
    if (/\b(ai|gemini)\b/i.test(s)) return "Generating questions...";
    return s;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header Stepper */}
      <div className="flex flex-col items-center space-y-6">
        <button
          onClick={goHome}
          className="flex items-center space-x-2 text-[#FB7A58] hover:opacity-80 transition-opacity"
        >
          <ChevronLeft size={18} />
          <span className="text-sm font-black uppercase tracking-[0.2em]">
            Assignment
          </span>
        </button>

        <div className="w-full flex items-center justify-center space-x-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <span className="text-[15px] font-black text-[#1E1E1E]">
                Create Assignment
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-bold opacity-60">
              Set up a new assignment for your students
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="w-1/2 h-full bg-[#FB7A58] rounded-full"></div>
          <div className="w-1/2 h-full bg-gray-100"></div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-[#F1F3F5] rounded-[40px] p-10 space-y-10 shadow-2xl shadow-black/5">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-[#1E1E1E] tracking-tight">
            Assignment Details
          </h3>
          <p className="text-sm text-gray-400 font-bold">
            Basic information about your assignment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label
              htmlFor="assignment-topic"
              className="text-[11px] font-black text-[#1E1E1E] uppercase tracking-widest"
            >
              Topic
            </label>
            <input
              id="assignment-topic"
              type="text"
              placeholder="e.g. Photosynthesis, Trigonometry..."
              className="w-full bg-[#F9FAFB] border border-[#F1F3F5] rounded-2xl px-6 py-4 text-sm font-bold text-[#1E1E1E] focus:ring-2 focus:ring-[#FB7A58]/20 focus:border-[#FB7A58] outline-none transition-all"
              value={cfg.topic || ""}
              onChange={(e) => setConfig({ topic: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <label
              htmlFor="assignment-grade"
              className="text-[11px] font-black text-[#1E1E1E] uppercase tracking-widest"
            >
              Grade Level
            </label>
            <select
              id="assignment-grade"
              className="w-full bg-[#F9FAFB] border border-[#F1F3F5] rounded-2xl px-6 py-4 text-sm font-bold text-[#1E1E1E] focus:ring-2 focus:ring-[#FB7A58]/20 focus:border-[#FB7A58] outline-none transition-all appearance-none"
              value={cfg.grade || ""}
              onChange={(e) => setConfig({ grade: e.target.value })}
            >
              <option value="">Select Grade</option>
              <option value="6th Grade">6th Grade</option>
              <option value="8th Grade">8th Grade</option>
              <option value="10th Grade">10th Grade</option>
              <option value="12th Grade">12th Grade</option>
            </select>
          </div>
          <div className="space-y-4">
            <label
              htmlFor="assignment-subject"
              className="text-[11px] font-black text-[#1E1E1E] uppercase tracking-widest"
            >
              Subject
            </label>
            <input
              id="assignment-subject"
              type="text"
              placeholder="e.g. Biology, Mathematics"
              className="w-full bg-[#F9FAFB] border border-[#F1F3F5] rounded-2xl px-6 py-4 text-sm font-bold text-[#1E1E1E] focus:ring-2 focus:ring-[#FB7A58]/20 focus:border-[#FB7A58] outline-none transition-all"
              value={cfg.subject || ""}
              onChange={(e) => setConfig({ subject: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label
                htmlFor="assignment-duration"
                className="text-[11px] font-black text-[#1E1E1E] uppercase tracking-widest"
              >
                Duration
              </label>
              <input
                id="assignment-duration"
                type="text"
                placeholder="e.g. 60 mins"
                className="w-full bg-[#F9FAFB] border border-[#F1F3F5] rounded-2xl px-6 py-4 text-sm font-bold text-[#1E1E1E] focus:ring-2 focus:ring-[#FB7A58]/20 focus:border-[#FB7A58] outline-none transition-all"
                value={cfg.duration || ""}
                onChange={(e) => setConfig({ duration: e.target.value })}
              />
            </div>
            <div className="space-y-4">
              <label
                htmlFor="assignment-due-date"
                className="text-[11px] font-black text-[#1E1E1E] uppercase tracking-widest"
              >
                Due Date
              </label>
              <input
                id="assignment-due-date"
                type="date"
                className="w-full bg-[#F9FAFB] border border-[#F1F3F5] rounded-2xl px-6 py-4 text-sm font-bold text-[#1E1E1E] focus:ring-2 focus:ring-[#FB7A58]/20 focus:border-[#FB7A58] outline-none transition-all"
                value={cfg.dueDate || ""}
                onChange={(e) => setConfig({ dueDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => document.getElementById("file-upload")?.click()}
          className={`border-2 border-dashed rounded-[32px] p-12 flex flex-col items-center justify-center space-y-4 transition-all cursor-pointer group ${
            fileName
              ? "border-[#FB7A58]/30 bg-[#FB7A58]/5"
              : "border-[#F1F3F5] bg-[#F9FAFB]/50 hover:border-[#FB7A58]/20"
          }`}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            aria-label="Upload assignment source file"
            onChange={onFileUpload}
            accept=".pdf,.docx,.txt"
          />
          {fileName ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#FB7A58]">
                <FileText size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-[#1E1E1E]">{fileName}</p>
                <p className="text-[11px] text-[#FB7A58] font-bold">
                  Successfully Uploaded
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#FB7A58] transition-all">
                <Upload size={32} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-black text-[#1E1E1E]">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-[11px] text-gray-400 font-bold">
                  PDF, Word Document, upto 10 MB
                </p>
              </div>
              <button className="px-6 py-2 bg-white border border-[#F1F3F5] rounded-xl text-[11px] font-black text-[#1E1E1E] hover:bg-gray-50 transition-all shadow-sm">
                Browse Files
              </button>
            </>
          )}
        </div>

        {/* Question Types Table */}
        <div className="space-y-6">
          <div className="grid grid-cols-12 gap-4 text-[11px] font-black text-gray-400 uppercase tracking-widest px-6">
            <div className="col-span-6">Question Type</div>
            <div className="col-span-3 text-center">No. of Questions</div>
            <div className="col-span-3 text-center">Marks per Item</div>
          </div>

          <div className="space-y-3">
            {(cfg.questionPatterns || []).map((pattern, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <div className="col-span-6">
                  <div className="bg-[#F9FAFB] border border-[#F1F3F5] rounded-2xl px-6 py-4 flex items-center justify-between group hover:border-[#FB7A58]/20 transition-all relative">
                    <label htmlFor={`question-type-${i}`} className="sr-only">
                      Question type
                    </label>
                    <input
                      id={`question-type-${i}`}
                      type="text"
                      placeholder="Enter question type"
                      className="bg-transparent text-sm font-black text-[#1E1E1E] outline-none w-full"
                      value={pattern.type || ""}
                      onChange={(e) =>
                        updatePattern(i, { type: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      aria-label="Remove question type"
                      onClick={() => removePattern(i)}
                      className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="bg-[#F9FAFB] border border-[#F1F3F5] rounded-2xl px-4 py-4 flex items-center justify-between">
                    <button
                      type="button"
                      aria-label="Decrease question count"
                      onClick={() =>
                        updatePattern(i, {
                          count: Math.max(1, pattern.count - 1),
                        })
                      }
                      className="text-gray-300 hover:text-[#1E1E1E] transition-colors font-black"
                    >
                      -
                    </button>
                    <span className="text-sm font-black text-[#1E1E1E] w-8 text-center">
                      {pattern.count}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase question count"
                      onClick={() =>
                        updatePattern(i, { count: pattern.count + 1 })
                      }
                      className="text-gray-300 hover:text-[#1E1E1E] transition-colors font-black"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="bg-[#F9FAFB] border border-[#F1F3F5] rounded-2xl px-4 py-4 flex items-center justify-between">
                    <button
                      type="button"
                      aria-label="Decrease marks per question"
                      onClick={() =>
                        updatePattern(i, {
                          marks: Math.max(1, pattern.marks - 1),
                        })
                      }
                      className="text-gray-300 hover:text-[#1E1E1E] transition-colors font-black"
                    >
                      -
                    </button>
                    <span className="text-sm font-black text-[#1E1E1E] w-8 text-center">
                      {pattern.marks}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase marks per question"
                      onClick={() =>
                        updatePattern(i, { marks: pattern.marks + 1 })
                      }
                      className="text-gray-300 hover:text-[#1E1E1E] transition-colors font-black"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addPattern}
            className="flex items-center space-x-3 px-6 py-4 bg-white border border-[#F1F3F5] rounded-2xl text-[#1E1E1E] hover:border-[#FB7A58]/20 transition-all shadow-sm group"
          >
            <div className="w-5 h-5 bg-[#FB7A58]/10 text-[#FB7A58] rounded-md flex items-center justify-center">
              <Plus size={14} strokeWidth={3} />
            </div>
            <span className="text-sm font-black">Add Question Type</span>
          </button>
        </div>

        {/* Total Marks Summary */}
        <div className="pt-6 flex flex-col items-end space-y-1 border-t border-[#F1F3F5]">
          <div className="flex items-center space-x-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Total Questions :
            </span>
            <span className="text-[15px] font-black text-[#1E1E1E]">
              {totalQuestions}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Total Marks :
            </span>
            <span className="text-[15px] font-black text-[#1E1E1E]">
              {totalMarks}
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <label className="text-[11px] font-black text-[#1E1E1E] uppercase tracking-widest">
            Additional Instructions
          </label>
          <textarea
            placeholder="e.g Generate a question paper for 3 hour exam duration.."
            className="w-full bg-[#F9FAFB] border border-[#F1F3F5] rounded-[32px] px-8 py-6 text-sm font-medium text-[#1E1E1E] focus:ring-2 focus:ring-[#FB7A58]/20 focus:border-[#FB7A58] outline-none transition-all min-h-[120px] resize-none"
            value={config.additionalInstructions || ""}
            onChange={(e) =>
              setConfig({ additionalInstructions: e.target.value })
            }
          />
        </div>
      </div>

      {isGenerating && generationProgress && (
        <div className="p-4 rounded-[32px] bg-[#FB7A58]/10 border border-[#FB7A58]/20 text-sm text-[#1E1E1E] font-bold">
          <div className="flex items-center justify-between gap-4">
            <span>{sanitizedProgressStatus(generationProgress)}</span>
            <span>{generationProgress.percentage}%</span>
          </div>
          <div className="h-2 mt-3 bg-[#F1F3F5] rounded-full overflow-hidden">
            <progress
              value={generationProgress.percentage}
              max={100}
              className="progress-bar"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={goHome}
          className="flex items-center space-x-3 px-10 py-4 bg-white border border-[#F1F3F5] rounded-full text-[#1E1E1E] hover:bg-gray-50 transition-all font-black text-sm shadow-sm group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Cancel</span>
        </button>
        <button
          onClick={onGenerate}
          disabled={isGenerating || !config.topic}
          className={`flex items-center space-x-3 px-12 py-4 bg-[#1E1E1E] text-white rounded-full hover:bg-black transition-all font-black text-sm shadow-xl shadow-black/5 group ${
            isGenerating || !config.topic ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Building Paper...</span>
            </>
          ) : (
            <>
              <span>Generate Assessment</span>
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateAssignment;
