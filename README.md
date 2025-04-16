# Mockhiato

**Mockhiato** is an AI-powered platform designed to help users prepare for mock interviews. Leveraging advanced technologies, it offers personalized interview experiences to enhance your readiness for real-world interviews.

## 🌐 Live Demo

Experience Mockhiato in action: [mockhiato.vercel.app](https://mockhiato.vercel.app)

## 🚀 Features

- **AI-Driven Interviews**: Engage in simulated interviews powered by AI, tailored to your chosen role and experience level.
- **Voice Interaction**: Communicate with the AI interviewer using voice, providing a realistic interview environment.
- **Personalized Feedback**: Receive detailed feedback on your performance, highlighting strengths and areas for improvement.
- **Resume Analysis**: Upload your resume to generate interviews based on your actual experience and skills.
- **Tech Stack Selection**: Customize your interview by selecting specific technologies or frameworks.
- **User Authentication**: Secure sign-in and account management to track your interview history and feedback.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **AI & Voice**: Vapi SDK for voice interactions
- **State Management**: React Hook Form
- **Styling**: Tailwind CSS

## 📂 Project Structure

Mockhiato/
├── app/  -> Next.js app directory (pages/routes)
│ ├── interview/ -> Routes for interview pages
│ ├── profile/ -> Routes for profile and user settings
│ └── layout.tsx -> Root layout component
├── components/ -> Reusable UI and logic components
│ ├── Agent.tsx -> AI interview agent
│ ├── DisplayTechIcons.tsx -> Renders selected tech stack icons
│ └── ... -> Other UI components
├── constants/ -> Static data like tech stacks
├── firebase/ -> Firebase config and initialization
├── lib/ -> Helper functions and API logic
│ ├── actions/ -> Firebase and app-specific API calls
│ └── utils.ts -> Utility functions
├── public/ -> Static assets (icons, images)
├── styles/ -> Global and custom CSS (if any)
├── types/ -> TypeScript interfaces and types
├── .env.local -> Environment variables (not committed)
├── tailwind.config.js -> Tailwind CSS configuration
├── tsconfig.json -> TypeScript configuration
├── package.json -> Project metadata and dependencies
└── README.md -> Project documentation



## 🧑‍💻 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rachithkad/Mockhiato.git
   cd Mockhiato

2. **Install dependencies**:
   ```bash
   npm install
      # or
   yarn install

3. **Set up environment variables**:

Create a .env.local file in the root directory and add the following:

FIREBASE_PROJECT_ID= your firebase project id
FIREBASE_PRIVATE_KEY= your firebase private key
FIREBASE_CLIENT_EMAIL= your firebase client email
GOOGLE_GENERATIVE_AI_API_KEY= your google generative ai key
NEXT_PUBLIC_VAPI_WEB_TOKEN= your vapi web token
NEXT_PUBLIC_VAPI_WORKFLOW_ID= your vapi workflow

4. **Run the development server**:
   ```bash
   npm run dev
      # or
   yarn dev

Open http://localhost:3000 in your browser to view the application.

**Hope this helps you with your Interviews @Kadiri_Rachith**