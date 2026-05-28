export interface Question {
  id: string;
  type: "mcq" | "short" | "diagram" | "numerical";
  question: string;
  options?: string[];
  answer: string;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface ExamSection {
  title: string;
  instructions: string;
  questions: Question[];
}

export interface Exam {
  id: string;
  title: string;
  institution: string;
  subject: string;
  grade: string;
  difficulty?: "easy" | "medium" | "hard";
  duration: string;
  dueDate?: string;
  totalMarks: number;
  sections: ExamSection[];
}

export interface QuestionPattern {
  type: string;
  count: number;
  marks: number;
}

export interface GenerationConfig {
  topic: string;
  grade: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  dueDate?: string;
  markWeightage: number;
  questionTypes: string[];
  questionPatterns: QuestionPattern[];
  additionalInstructions?: string;
}
