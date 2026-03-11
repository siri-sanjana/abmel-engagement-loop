# ABMEL — Autonomous Brand Marketing Engagement Loop

ABMEL is a state-of-the-art autonomous marketing platform designed to orchestrate complex creative workflows using AI agents. It simplifies the entire campaign lifecycle, from brand context ingestion to high-fidelity creative generation and optimization.

![ABMEL Dashboard](https://raw.githubusercontent.com/Varshithathi2006/ABMBEL---Marketing-Engagement-loop/main/water_bottle.png)

## 🚀 Key Features

- **Autonomous Agent Orchestration**: Powered by LangChain, the system manages a suite of specialized agents (Planning, Market Research, Persona, and Creative) to build holistic marketing strategies.
- **Dynamic Campaign Setup**: Fully customizable campaign briefings including:
  - Multi-variant selector (1-10 variants).
  - Brand Guardrail file uploads (PDF, DOCX, TXT) with Supabase Storage integration.
  - Expanded product and audience profiling.
- **AI-Driven Creative Suite**:
  - High-fidelity image generation via Pollinations AI.
  - **Magic Wand Image Editor**: Describe changes in natural language to refine and regenerate specific variants.
  - Complete compliance reporting based on brand guardrails.
- **Neural Interface**: A premium, dark-mode chat interface for interacting with the AI agents in real-time.
- **Campaign Archive**: Persist and review all historical campaign data, agent logs, and creative artifacts.

## 🛠 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/)
- **Backend**: [Supabase](https://supabase.com/) (Database, Authentication, Storage)
- **AI/ML**: [LangChain](https://js.langchain.com/), [Groq](https://groq.com/), [Pollinations AI](https://pollinations.ai/)

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- NPM or Yarn
- Supabase project credentials
- Hugging Face or Groq API keys

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Varshithathi2006/ABMBEL---Marketing-Engagement-loop.git
   cd ABMBEL---Marketing-Engagement-loop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GROQ_API_KEY=your_groq_key
   HF_TOKEN=your_hugging_face_token
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/components`: UI components and agent interaction widgets.
- `src/pages`: Main application views (Dashboard, Setup, Review, Archive).
- `src/services`: API clients, Supabase service, and LangChain agent logic.
- `src/store`: Zustand state management modules.
- `src/scripts`: Utility scripts for image syncing and verification.

---

Built with 💜 by the ABMEL Team.

