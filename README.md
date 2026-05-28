# VedaAI Exam Generator - Teacher Toolkit

A comprehensive full-stack application built for the VedaAI Build & Deploy Challenge. This toolkit allows teachers to generate high-quality, academic exam papers using AI and manage them through a professional dashboard.

## 🚀 Features

- **AI Generation**: Powered by Gemini 1.5 Pro with structured academic prompting.
- **Real-time Progress**: WebSocket integration for granular generation status updates.
- **Teacher Dashboard**: High-level overview of generated assessments and statistics.
- **Exam History**: Persistent storage of all assignments for future reference.
- **Print Perfection**: CSS-optimized layouts for professional academic printing.
- **Pixel-Perfect UI**: Replicated Figma design with modern animations and responsiveness.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS (v4), Zustand, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, Gemini AI SDK, TSX.
- **State Management**: Zustand with persistent storage.

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- Gemini API Key

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd AssesmentCreator
   ```

2. **Backend Setup**:

   ```bash
   cd backend
   npm install
   # Create .env and add GEMINI_API_KEY=your_key
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## User Data and Privacy

- This project isolates exams per teacher account. The frontend requests only the logged-in user's exams from the backend (via `GET /exams?owner=<email>`). This prevents a newly logged-in user from seeing another teacher's (for example, "James") saved assignments.
- When creating/generating an exam, the frontend includes the logged-in user's email with the generation request; the backend saves the resulting exam with that owner email. Only the owner can retrieve their exams.

If you need a shared/public example exam for demonstrations, add an exam entry with `owner` omitted in `backend/data/exams.json`, but by default the app will not surface other users' data to new logins.

## Notes for Assignment Target

- Behavior: New users who sign in will only see their own exams. They will not see previously persisted exams belonging to other users.
- To test as a fresh user in the same browser, clear local storage key `veda-ai-storage` or open an incognito window.
