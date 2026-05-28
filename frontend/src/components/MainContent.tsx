"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Exam } from "@/types";
import { useAppStore } from "@/store/useAppStore";

let socket: Socket;

import ExamView from "@/components/ExamView";
import Dashboard from "@/components/Dashboard";
import ExamHistory from "@/components/ExamHistory";
import Login from "@/components/Login";
import CreateAssignment from "@/components/CreateAssignment";
import MyGroups from "@/components/MyGroups";
import MyLibrary from "@/components/MyLibrary";
import Settings from "@/components/Settings";

export default function MainContent() {
  const {
    user,
    config,
    setExam,
    currentExam,
    setProgress,
    setGenerating,
    setView,
    addExam,
    resetConfig,
    loadExams,
  } = useAppStore();
  const pathname = usePathname();

  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  // Initialize socket and data
  useEffect(() => {
    if (!user) return;

    if (user && user.email) {
      loadExams(user.email);
    }
    socket = io("http://localhost:3001");

    socket.on("progress", (progress) => {
      setProgress(progress);
    });

    socket.on("exam-generated", (exam: Exam) => {
      addExam(exam);
      setGenerating(false);
      setProgress(null);
    });

    socket.on("error", (error) => {
      console.error("Generation error:", error);
      setGenerating(false);
      setProgress(null);
      const msg =
        (error && (error.message || error.msg)) ||
        "Failed to generate exam. Please try again.";
      alert(msg);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user, setProgress, setGenerating, addExam, resetConfig, loadExams]);

  // Sync store view with URL path
  useEffect(() => {
    if (!user) return;
    const viewFromPath =
      pathname === "/" ? "dashboard" : pathname.replace(/^\/+/, "");
    setView(viewFromPath as any);
  }, [pathname, user, setView]);

  if (!user) {
    return <Login />;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:3001/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.text) {
          setFileContent(data.text);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setFileContent(
          `[SOURCE DOCUMENT: ${file.name}]\nTopic context for ${config.topic}`,
        );
      }
    }
  };

  const handleGenerate = () => {
    const hasInvalidPattern = (config.questionPatterns || []).some(
      (pattern) => !pattern.type || pattern.count <= 0 || pattern.marks <= 0,
    );

    if (
      !config.topic.trim() ||
      !config.grade ||
      !config.subject.trim() ||
      !config.dueDate
    ) {
      alert("Please fill in Topic, Subject, Grade, and Due Date.");
      return;
    }

    if ((config.questionPatterns || []).length === 0 || hasInvalidPattern) {
      alert(
        "Please add at least one valid question type with a positive count and marks.",
      );
      return;
    }

    setGenerating(true);
    setProgress({
      status: "Submitting assignment to AI engine...",
      percentage: 5,
    });
    socket.emit("generate-exam", {
      ...config,
      syllabusContext: fileContent,
      ownerEmail: user?.email,
    });
  };

  if (currentExam) {
    return (
      <ExamView
        exam={currentExam}
        onBack={() => setExam(null)}
        onRegenerate={handleGenerate}
      />
    );
  }

  const v = pathname === "/" ? "dashboard" : pathname.replace(/^\/+/, "");

  if (v === "dashboard") return <Dashboard />;
  if (v === "history") return <ExamHistory />;
  if (v === "groups") return <MyGroups />;
  if (v === "library") return <MyLibrary />;
  if (v === "settings") return <Settings />;
  if (v === "create") {
    return (
      <CreateAssignment
        onFileUpload={handleFileUpload}
        onGenerate={handleGenerate}
        fileName={fileName}
      />
    );
  }

  return <Dashboard />;
}
