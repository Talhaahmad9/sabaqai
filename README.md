# SabaqAI — AI Study Partner for Students

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Powered by AWS Bedrock](https://img.shields.io/badge/Powered%20by-AWS%20Bedrock-232F3E?logo=amazonaws&logoColor=white)](https://aws.amazon.com/bedrock/)
[![Amazon Nova AI](https://img.shields.io/badge/Amazon-Nova%20AI-FF9900?logo=amazon&logoColor=white)](https://aws.amazon.com/ai/generative-ai/)
[![Database MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

An AI-powered study partner that lets students upload lecture materials and chat with an intelligent tutor in Roman Urdu or English — answers are grounded directly in their own course content.

---

## 📚 Overview

**SabaqAI** is an AI-first study platform built for students.

Students can upload their lecture slides and notes (**PDF** / **PowerPoint**) and then:

- Ask questions in **Roman Urdu** or **English**
- Get **grounded, citation-rich answers** sourced directly from their uploaded materials
- Track what topics they are weak in and monitor their study progress

SabaqAI is built as an entry for the **Amazon Nova AI Hackathon**, showcasing how **Amazon Nova Lite** and **Amazon Bedrock** can power intelligent, localized study experiences for universities and students in Pakistan and beyond.

---

## ✨ Features

- **📁 Upload Lecture Slides (PDF & PPT)**  
  Students can upload lecture decks and notes in both **PDF** and **PowerPoint** formats.

- **🤖 AI Chat Powered by Amazon Nova Lite (AWS Bedrock)**  
  Study conversations are powered by **Amazon Nova Lite v1** via **Amazon Bedrock**, with answers grounded in retrieved lecture content.

- **🌐 Roman Urdu & English Support**  
  Seamless **language toggle** between Roman Urdu and English to support local vernacular and broader accessibility.

- **📌 Grounded Answers with Citations**  
  Every answer is **sourced from uploaded materials**, with **file-level citations** so students know _where_ information came from.

- **📑 Automatic PPT → PDF Conversion**  
  PowerPoint files are converted to PDF using the **CloudConvert API**, standardizing downstream processing and chunking.

- **🕒 Study Session History & Chat Persistence**  
  Students can revisit previous study sessions with **persistent chat history**.

- **📉 Weak Topic Detection & Progress Tracking**  
  The system identifies **weak topics** based on questions and responses, helping students prioritize what to revise.

- **🏫 IoBM Programs Pre-loaded**  
  Common **IoBM (Institute of Business Management)** programs and course structures are pre-configured for quick onboarding.

- **🌑 Beautiful Dark UI**  
  A premium, editorial-style **dark interface** with:
  - Typing effects
  - Smooth Framer Motion transitions
  - Markdown-rendered answers
  - Subtle pixel/star background animations in the hero section

---

## 🛠 Tech Stack

| Category       | Technology                                                                 |
| -------------- | -------------------------------------------------------------------------- |
| **Frontend**   | Next.js 16 (App Router), Tailwind CSS, Framer Motion                      |
| **Backend**    | Next.js API Routes (App Router)                                           |
| **AI / ML**    | Amazon Bedrock, Amazon Nova Lite v1, Bedrock Knowledge Base               |
| **Vector DB**  | Amazon OpenSearch Serverless                                              |
| **File Storage** | Amazon S3                                                               |
| **Database**   | MongoDB Atlas                                                             |
| **Auth**       | NextAuth.js v4                                                            |
| **File Conversion** | CloudConvert API                                                     |
| **Deployment** | Vercel                                                                    |

---

## 🧠 Architecture (RAG Pipeline)

SabaqAI uses a **Retrieval-Augmented Generation (RAG)** architecture to ensure that all answers are grounded in the student's own uploaded content.

**High-level flow:**

1. **Upload**  
   - Student uploads **PDF** or **PPT**.  
   - PPT files are converted to **PDF** using **CloudConvert**.  
   - Final PDFs are stored in **Amazon S3**.

2. **Ingestion & Indexing**  
   - An **Amazon Bedrock Knowledge Base** monitors the S3 bucket.  
   - Knowledge Base **syncs**, **chunks**, and **embeds** the PDFs using **Titan Embeddings V2**.  
   - Embeddings are stored in **Amazon OpenSearch Serverless**.

3. **Question Answering**  
   - User asks a question in **Roman Urdu or English** through the chat UI.  
   - The question is sent to **Amazon Bedrock**, which:
     - Retrieves the **most relevant chunks** from OpenSearch.  
     - Passes those chunks as context into **Amazon Nova Lite v1**.

4. **Response Generation**  
   - Nova Lite generates a **grounded answer** using the retrieved context.  
   - The answer includes **citations** back to the underlying files/sections.  
   - Response, metadata, and context are persisted (MongoDB) for **session history** and **weak topic analysis**.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** or **pnpm** or **yarn** (examples below use `npm`)
- An **AWS account** with access to:
  - **Amazon Bedrock** (Nova Lite, Titan Embeddings)
  - **Amazon S3**
  - **Amazon OpenSearch Serverless**
- **MongoDB Atlas** cluster
- **CloudConvert** account + API key
- **NextAuth** secrets for authentication

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/sabaqai.git
cd sabaqai

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Run the development server
npm run dev

# App will be available at
# http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root (or edit if already present) and set the following environment variables:

| Variable              | Description                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `MONGODB_URI`         | MongoDB Atlas connection string for persisting users, sessions, and study data.            |
| `AWS_REGION`          | AWS region where Bedrock, S3, and OpenSearch are hosted (e.g., `us-east-1`).               |
| `AWS_ACCESS_KEY_ID`   | AWS access key ID with permissions for Bedrock, S3, and OpenSearch.                        |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key corresponding to the above access key.                            |
| `AWS_S3_BUCKET_NAME`  | S3 bucket name where uploaded lecture PDFs are stored.                                     |
| `BEDROCK_KB_ID`       | Amazon Bedrock Knowledge Base ID configured for this app.                                  |
| `BEDROCK_DS_ID`       | Data source ID associated with the Bedrock Knowledge Base (linked to the S3 bucket).       |
| `NEXTAUTH_SECRET`     | Secret used by NextAuth.js to sign and encrypt tokens.                                      |
| `NEXTAUTH_URL`        | Public base URL of your deployment (e.g., `http://localhost:3000` or production URL).      |
| `CLOUDCONVERT_API_KEY`| API key for CloudConvert to handle PPT → PDF conversions.                                  |

> 💡 Tip: Never commit your `.env.local` file to version control. Ensure it is listed in `.gitignore`.

---

## 📁 Project Structure

> This is a simplified view of the most relevant folders and files.

```bash
.
├── app/
│   ├── layout.js           # Root layout, global providers, and base HTML shell
│   ├── page.js             # Main landing page / home route
│   └── api/
│       └── test/
│           └── route.js    # Example API route (can be extended for chat/upload APIs)
│
├── components/
│   └── landing/
│       ├── LandingPageShell.jsx  # High-level landing page shell & background
│       ├── HeroSection.jsx       # Hero with animated grid and pixel/star background
│       ├── Navbar.jsx            # Top navigation bar
│       ├── FeaturesSection.jsx   # Feature highlights
│       ├── HowItWorksSection.jsx # RAG explanation / product flow
│       ├── CTASection.jsx        # Call-to-action area
│       └── Footer.jsx            # Footer with links & credits
│
├── lib/
│   ├── mongodb.js          # MongoDB connection helper
│   └── models/
│       ├── User.js         # User model (Mongoose)
│       └── Session.js      # Session / study session model
│
├── public/                 # Static assets (icons, SVGs)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── package.json
└── README.md
```

- **`app/`** — Next.js App Router pages and API routes.
- **`components/landing/`** — Landing page UI components and animations.
- **`lib/`** — Database connections and Mongoose models.
- **`public/`** — Static, publicly served assets.

---

## 🖼 Screenshots

> Screenshots coming soon.

Once the UI is finalized and deployed, this section will showcase:

- Landing page hero with animated pixels and blobs
- AI chat interface with Roman Urdu + English toggle
- File upload flow and citation view
- Study history and topic insights

---

## 🏆 Hackathon

SabaqAI was built for the **Amazon Nova AI Hackathon**.

- **Tracks / Categories:**
  - Multimodal Understanding
  - Voice AI
- **Prize Pool:**
  - **$40,000** in cash prizes  
  - **$55,000** in AWS credits

The project demonstrates how **Amazon Nova Lite**, **Bedrock Knowledge Bases**, and **OpenSearch Serverless** can be combined to build a localized, student-centric study companion.

---

## 👤 Author

Made with love by **Talha Ahmad**  
Portfolio: [https://talhaahmad.vercel.app](https://talhaahmad.vercel.app)

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this software, provided that the original license and copyright notice are included.
