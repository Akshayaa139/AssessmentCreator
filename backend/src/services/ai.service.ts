import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Exam, GenerationConfig } from "../types/index.js";

export async function setupAIGeneration(
  config: GenerationConfig,
  onProgress: (progress: { status: string; percentage: number }) => void,
): Promise<Exam> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = apiKey
    ? new GoogleGenerativeAI(apiKey).getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        },
      })
    : null;

  onProgress({ status: "Analyzing requirements...", percentage: 20 });

  const questionPlan =
    (config.questionPatterns || [])
      .map(
        (pattern) =>
          `- ${pattern.count} ${pattern.type} question(s), ${pattern.marks} mark(s) each`,
      )
      .join("\n") || "- Use a balanced mix of question types.";

  const prompt = `
    Generate a comprehensive exam paper in JSON format based on the following configurations:
    Topic: ${config.topic}
    Subject: ${config.subject || config.topic}
    Grade Level: ${config.grade}
    Duration: ${config.duration || "60 mins"}
    Due Date: ${config.dueDate || "N/A"}
    Difficulty Level: ${config.difficulty}
    Average Marks/Question: ${config.markWeightage}
    Required Question Pattern:
    ${questionPlan}
    Additional Context/Instructions: ${config.additionalInstructions || "Standard academic examination structure"}
    Syllabus Reference (Extracted Content): ${config.syllabusContext || "No syllabus provided. Generate based on topic alone."}

    The output MUST be a valid JSON object matching this structure:
    {
      "id": "unique-id",
      "title": "Exam Title",
      "institution": "Institution Name",
      "subject": "Subject Name",
      "grade": "${config.grade}",
      "duration": "Duration (e.g., 60 mins)",
      "totalMarks": total_marks_calculated,
      "sections": [
        {
          "title": "Section Title",
          "instructions": "Section Instructions",
          "questions": [
            {
              "id": "q1",
              "type": "mcq | short | diagram | numerical",
              "question": "Question text",
              "options": ["Option A", "Option B", "Option C", "Option D"], // Only for mcq
              "answer": "Correct Answer",
              "marks": number,
              "difficulty": "easy | medium | hard"
            }
          ]
        }
      ]
    }

    Ensure the questions are academic, accurate, and follow the specified difficulty level and types.
    The number of generated questions and marks must follow the required question pattern exactly.
    Do not include any text other than the JSON object.
  `;

  onProgress({
    status: "Generating questions via Gemini AI...",
    percentage: 40,
  });

  if (!model) {
    onProgress({
      status: "No API key configured. Generating exam locally...",
      percentage: 50,
    });
    const totalMarks = (config.questionPatterns || []).reduce(
      (sum, pattern) => sum + pattern.count * pattern.marks,
      0,
    );

    return {
      id: Math.random().toString(36).substring(7),
      title: `${config.topic} Assessment`,
      institution: "VedaAI Academy",
      subject: config.subject || config.topic,
      grade: config.grade,
      duration: config.duration || "60 mins",
      ...(config.dueDate ? { dueDate: config.dueDate } : {}),
      totalMarks,
      sections: (config.questionPatterns || []).map((pattern, index) => ({
        title: `Section ${String.fromCharCode(65 + index)}`,
        instructions: "Attempt all questions in this section.",
        questions: Array.from({ length: pattern.count }, (_, qIndex) => {
          const isMcq = pattern.type.toLowerCase().includes("mcq");

          return {
            id: `${index + 1}.${qIndex + 1}`,
            type: isMcq ? "mcq" : "short",
            question: `Sample ${pattern.type} question ${qIndex + 1} related to ${config.topic}.`,
            ...(isMcq
              ? { options: ["Option A", "Option B", "Option C", "Option D"] }
              : {}),
            answer: "Sample answer",
            marks: pattern.marks,
            difficulty: config.difficulty || "medium",
          };
        }),
      })),
    };
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  onProgress({ status: "Formatting exam structure...", percentage: 70 });

  // Clean up JSON if LLM added markdown backticks
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const exam: Exam = JSON.parse(text);

    onProgress({ status: "Finalizing exam paper...", percentage: 90 });

    // Ensure ID is unique
    exam.id = Math.random().toString(36).substring(7);

    // Preserve author inputs if AI omits them
    exam.title = exam.title || `${config.topic} Assessment`;
    exam.institution = exam.institution || "VedaAI Academy";
    exam.subject = exam.subject || config.subject || config.topic;
    exam.grade = exam.grade || config.grade;
    exam.duration = exam.duration || config.duration || "60 mins";
    if (config.dueDate) {
      exam.dueDate = config.dueDate;
    }

    // Calculate total marks if not provided correctly
    exam.totalMarks = exam.sections.reduce(
      (acc, section) =>
        acc + section.questions.reduce((qAcc, q) => qAcc + q.marks, 0),
      0,
    );

    onProgress({ status: "Complete!", percentage: 100 });
    return exam;
  } catch (error) {
    console.error("JSON Parse Error:", text);
    throw new Error("Failed to parse AI response into valid exam format.");
  }
}
