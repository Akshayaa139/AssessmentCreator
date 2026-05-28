import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { setupAIGeneration } from "./services/ai.service.js";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXAMS_FILE = path.join(__dirname, "../data/exams.json");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with frontend URL
    methods: ["GET", "POST"],
  },
});

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Ensure data directory exists
if (!fs.existsSync(path.dirname(EXAMS_FILE))) {
  fs.mkdirSync(path.dirname(EXAMS_FILE), { recursive: true });
}

// persistence helper
const saveExam = (exam: any) => {
  const exams = JSON.parse(fs.readFileSync(EXAMS_FILE, "utf-8") || "[]");
  exams.unshift(exam);
  fs.writeFileSync(EXAMS_FILE, JSON.stringify(exams, null, 2));
};

const decodeXmlEntities = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const extractDocxText = (buffer: Buffer) => {
  const eocdSignature = 0x06054b50;
  const centralSignature = 0x02014b50;
  const localSignature = 0x04034b50;

  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === eocdSignature) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error("Invalid DOCX archive.");
  }

  const entries = buffer.readUInt16LE(eocdOffset + 10);
  let centralOffset = buffer.readUInt32LE(eocdOffset + 16);

  for (let i = 0; i < entries; i++) {
    if (buffer.readUInt32LE(centralOffset) !== centralSignature) {
      throw new Error("Invalid DOCX central directory.");
    }

    const compressionMethod = buffer.readUInt16LE(centralOffset + 10);
    const compressedSize = buffer.readUInt32LE(centralOffset + 20);
    const fileNameLength = buffer.readUInt16LE(centralOffset + 28);
    const extraLength = buffer.readUInt16LE(centralOffset + 30);
    const commentLength = buffer.readUInt16LE(centralOffset + 32);
    const localHeaderOffset = buffer.readUInt32LE(centralOffset + 42);
    const fileName = buffer.toString(
      "utf-8",
      centralOffset + 46,
      centralOffset + 46 + fileNameLength,
    );

    if (fileName === "word/document.xml") {
      if (buffer.readUInt32LE(localHeaderOffset) !== localSignature) {
        throw new Error("Invalid DOCX local file header.");
      }

      const localFileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
      const dataStart =
        localHeaderOffset + 30 + localFileNameLength + localExtraLength;
      const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
      const xmlBuffer =
        compressionMethod === 0 ? compressed : zlib.inflateRawSync(compressed);
      const xml = xmlBuffer.toString("utf-8");

      return (
        xml
          .replace(/<w:tab\/>/g, "\t")
          .replace(/<w:br\/>/g, "\n")
          .replace(/<\/w:p>/g, "\n")
          .match(/<w:t[^>]*>(.*?)<\/w:t>/g)
          ?.map((textNode) =>
            decodeXmlEntities(textNode.replace(/<\/?w:t[^>]*>/g, "")),
          )
          .join(" ")
          .replace(/\s+\n/g, "\n")
          .replace(/[ \t]{2,}/g, " ")
          .trim() || ""
      );
    }

    centralOffset += 46 + fileNameLength + extraLength + commentLength;
  }

  throw new Error("DOCX document body not found.");
};

// API Endpoints
app.get("/exams", (req, res) => {
  const exams = JSON.parse(fs.readFileSync(EXAMS_FILE, "utf-8") || "[]");
  const owner = String(req.query.owner || "").trim();

  if (owner) {
    // Return only exams belonging to the requesting owner
    const filtered = exams.filter((e: any) => e.owner === owner);
    return res.json(filtered);
  }

  // If no owner provided, return an empty list to avoid exposing other users' data
  return res.json([]);
});

// Real File Processing Endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let extractedText = "";
    if (req.file.mimetype === "application/pdf") {
      const data = await pdf(req.file.buffer);
      extractedText = data.text;
    } else if (
      req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      req.file.originalname.toLowerCase().endsWith(".docx")
    ) {
      extractedText = extractDocxText(req.file.buffer);
    } else {
      extractedText = req.file.buffer.toString("utf-8");
    }

    console.log(
      `Extracted ${extractedText.length} chars from ${req.file.originalname}`,
    );
    res.json({ text: extractedText, fileName: req.file.originalname });
  } catch (error) {
    console.error("Extraction error:", error);
    res.status(500).json({ error: "Failed to process document" });
  }
});

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("generate-exam", async (config) => {
    console.log("Generating exam with config:", config);

    try {
      // Mock progress updates
      socket.emit("progress", {
        status: "Connecting to AI model...",
        percentage: 10,
      });

      const exam = await setupAIGeneration(config, (progress) => {
        socket.emit("progress", progress);
      });
      // Attach owner information if provided in the config
      if (config && config.ownerEmail) {
        (exam as any).owner = config.ownerEmail;
      }

      saveExam(exam);
      socket.emit("exam-generated", exam);
    } catch (error) {
      console.error("Generation error:", error);
      socket.emit("error", {
        message: "Failed to generate exam. Please try again.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/health", (req, res) => {
  res.send({ status: "ok" });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
