"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Types ───────────────────────────────────────────────────── */

type Step = "details" | "ai-level" | "content" | "review" | "generating" | "complete";
type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";
type AILevel = "extensive" | "moderate" | "minimal";
type ContentType =
  | "video-course"
  | "text-course"
  | "workshop"
  | "certification"
  | "mini-course";

interface CourseConfig {
  title: string;
  description: string;
  contentType: ContentType;
  difficulty: Difficulty;
  sections: number;
  aiLevel: AILevel;
  uploadedFiles: string[];
  generateImages: boolean;
}

/* ── Icon helper ─────────────────────────────────────────────── */

function Icon({
  d,
  className = "w-5 h-5",
}: {
  d: string;
  className?: string;
}) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );
}

/* ── Constants ───────────────────────────────────────────────── */

const CONTENT_TYPES: { value: ContentType; label: string; desc: string }[] = [
  { value: "video-course", label: "Video Course", desc: "Structured video lessons with outlines and scripts" },
  { value: "text-course", label: "Text Course", desc: "Written lessons with exercises and quizzes" },
  { value: "workshop", label: "Workshop", desc: "Hands-on project-based learning modules" },
  { value: "certification", label: "Certification Program", desc: "Comprehensive program with assessments" },
  { value: "mini-course", label: "Mini Course", desc: "Quick 3-5 lesson focused course" },
];

const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: "beginner", label: "Beginner", color: "green" },
  { value: "intermediate", label: "Intermediate", color: "blue" },
  { value: "advanced", label: "Advanced", color: "amber" },
  { value: "expert", label: "Expert", color: "red" },
];

const AI_LEVELS: { value: AILevel; label: string; desc: string; pct: string }[] = [
  {
    value: "extensive",
    label: "Extensive",
    desc: "AI writes the entire course for you — full content, quizzes, assignments, and summaries. You just review and publish.",
    pct: "90-100%",
  },
  {
    value: "moderate",
    label: "Moderate",
    desc: "AI builds the structure, writes lesson outlines, and drafts key content. You fill in details and add your expertise.",
    pct: "50-60%",
  },
  {
    value: "minimal",
    label: "Minimal",
    desc: "AI only creates the course structure and section headings. You provide all the content. Light formatting assistance only.",
    pct: "10-20%",
  },
];

/* ── Component ───────────────────────────────────────────────── */

export default function CourseBuilderPage() {
  const [step, setStep] = useState<Step>("details");
  const [config, setConfig] = useState<CourseConfig>({
    title: "",
    description: "",
    contentType: "text-course",
    difficulty: "intermediate",
    sections: 8,
    aiLevel: "moderate",
    uploadedFiles: [],
    generateImages: true,
  });
  const [dragOver, setDragOver] = useState(false);

  const steps: { key: Step; label: string; num: number }[] = [
    { key: "details", label: "Course Details", num: 1 },
    { key: "ai-level", label: "AI Level", num: 2 },
    { key: "content", label: "Your Content", num: 3 },
    { key: "review", label: "Review", num: 4 },
  ];

  const stepIndex = steps.findIndex((s) => s.key === step);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const names = Array.from(files).map((f) => f.name);
      setConfig((prev) => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...names],
      }));
    }
  }

  function removeFile(name: string) {
    setConfig((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((f) => f !== name),
    }));
  }

  function handleGenerate() {
    setStep("generating");
    // Simulate generation
    setTimeout(() => setStep("complete"), 4000);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-gray-800/50">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-cyan-400">0n</span>
          <span className="text-gray-400 text-lg ml-1">Apps</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/marketplace" className="text-sm text-gray-400 hover:text-white transition">
            Marketplace
          </Link>
          <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition">
            Sign In
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Icon
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              className="w-7 h-7 text-purple-400"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">0n Course Builder</h1>
            <p className="text-sm text-gray-500">
              AI-powered course creation in minutes
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        {step !== "generating" && step !== "complete" && (
          <div className="flex items-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i <= stepIndex
                      ? "bg-purple-500 text-white"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-xs hidden sm:block ${
                    i <= stepIndex ? "text-white" : "text-gray-600"
                  }`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px ${
                      i < stepIndex ? "bg-purple-500" : "bg-gray-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Course Details */}
        {step === "details" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Mastering Social Media Marketing for Small Business"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                What is this course about?
              </label>
              <textarea
                value={config.description}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe what students will learn, the target audience, and the key outcomes..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Content Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() =>
                      setConfig((p) => ({ ...p, contentType: ct.value }))
                    }
                    className={`text-left p-4 rounded-lg border transition ${
                      config.contentType === ct.value
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
                    }`}
                  >
                    <div className="text-sm font-medium">{ct.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{ct.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Difficulty Level
              </label>
              <div className="flex gap-3">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() =>
                      setConfig((p) => ({ ...p, difficulty: d.value }))
                    }
                    className={`flex-1 py-3 rounded-lg border text-sm font-medium transition ${
                      config.difficulty === d.value
                        ? `border-${d.color}-500 bg-${d.color}-500/10 text-${d.color}-400`
                        : "border-gray-800 bg-gray-900/50 text-gray-500 hover:border-gray-700"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Sections:{" "}
                <span className="text-purple-400">{config.sections}</span>
              </label>
              <input
                type="range"
                min={3}
                max={20}
                value={config.sections}
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    sections: parseInt(e.target.value),
                  }))
                }
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>3 sections</span>
                <span>20 sections</span>
              </div>
            </div>

            <button
              onClick={() => setStep("ai-level")}
              disabled={!config.title}
              className="w-full py-3 rounded-lg bg-purple-500 hover:bg-purple-600 font-medium transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next: Choose AI Level
            </button>
          </div>
        )}

        {/* Step 2: AI Level */}
        {step === "ai-level" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">
                How much should AI do?
              </h2>
              <p className="text-sm text-gray-500">
                Choose how much AI assistance you want. You can always edit
                everything after generation.
              </p>
            </div>

            <div className="space-y-4">
              {AI_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() =>
                    setConfig((p) => ({ ...p, aiLevel: level.value }))
                  }
                  className={`w-full text-left p-6 rounded-xl border transition ${
                    config.aiLevel === level.value
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">{level.label}</span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        config.aiLevel === level.value
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {level.pct} AI-generated
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{level.desc}</p>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/50">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.generateImages}
                  onChange={(e) =>
                    setConfig((p) => ({
                      ...p,
                      generateImages: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded accent-purple-500"
                />
                <div>
                  <div className="text-sm font-medium">
                    Generate Featured Images
                  </div>
                  <div className="text-xs text-gray-500">
                    AI creates a unique featured image for each course section
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("details")}
                className="flex-1 py-3 rounded-lg border border-gray-700 hover:border-gray-500 font-medium transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep("content")}
                className="flex-1 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 font-medium transition"
              >
                Next: Add Content
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Content Upload */}
        {step === "content" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">
                Upload Your Content{" "}
                <span className="text-gray-500 text-sm font-normal">
                  (Optional)
                </span>
              </h2>
              <p className="text-sm text-gray-500">
                Upload as much or as little as you want. No minimum required.
                The AI will work with whatever you provide — or generate
                everything from scratch.
              </p>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const files = e.dataTransfer.files;
                if (files) {
                  const names = Array.from(files).map((f) => f.name);
                  setConfig((prev) => ({
                    ...prev,
                    uploadedFiles: [...prev.uploadedFiles, ...names],
                  }));
                }
              }}
              className={`p-10 rounded-xl border-2 border-dashed text-center transition cursor-pointer ${
                dragOver
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700 bg-gray-900/30 hover:border-gray-600"
              }`}
            >
              <Icon
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                className="w-10 h-10 text-gray-600 mx-auto mb-3"
              />
              <p className="text-sm text-gray-400 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-600">
                PDF, DOCX, TXT, MD, MP4, MP3, images — any format
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block mt-4 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm cursor-pointer transition"
              >
                Browse Files
              </label>
            </div>

            {/* Uploaded Files */}
            {config.uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-widest">
                  Uploaded ({config.uploadedFiles.length} files)
                </p>
                {config.uploadedFiles.map((f) => (
                  <div
                    key={f}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-gray-900/50"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        className="w-4 h-4 text-gray-500"
                      />
                      <span className="text-sm">{f}</span>
                    </div>
                    <button
                      onClick={() => removeFile(f)}
                      className="text-gray-600 hover:text-red-400 transition"
                    >
                      <Icon d="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <p className="text-sm text-purple-300">
                {config.aiLevel === "extensive"
                  ? "With Extensive AI, the course will be fully generated even without uploaded content. Your uploads will be used as reference material to improve accuracy."
                  : config.aiLevel === "moderate"
                    ? "With Moderate AI, the structure and outlines will be generated. Your uploads will be incorporated into the lesson content directly."
                    : "With Minimal AI, only the structure will be generated. Your uploaded content will be organized into the sections you defined."}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("ai-level")}
                className="flex-1 py-3 rounded-lg border border-gray-700 hover:border-gray-500 font-medium transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep("review")}
                className="flex-1 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 font-medium transition"
              >
                Next: Review
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === "review" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Review Your Course</h2>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 divide-y divide-gray-800">
              {[
                { label: "Title", value: config.title },
                { label: "Description", value: config.description || "—" },
                {
                  label: "Content Type",
                  value:
                    CONTENT_TYPES.find((c) => c.value === config.contentType)
                      ?.label || config.contentType,
                },
                {
                  label: "Difficulty",
                  value:
                    config.difficulty.charAt(0).toUpperCase() +
                    config.difficulty.slice(1),
                },
                { label: "Sections", value: String(config.sections) },
                {
                  label: "AI Level",
                  value: `${
                    AI_LEVELS.find((a) => a.value === config.aiLevel)?.label
                  } (${
                    AI_LEVELS.find((a) => a.value === config.aiLevel)?.pct
                  })`,
                },
                {
                  label: "Featured Images",
                  value: config.generateImages ? "Yes — AI generated" : "No",
                },
                {
                  label: "Uploaded Content",
                  value:
                    config.uploadedFiles.length > 0
                      ? `${config.uploadedFiles.length} file(s)`
                      : "None — AI will generate from scratch",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-medium text-right max-w-[60%] truncate">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("content")}
                className="flex-1 py-3 rounded-lg border border-gray-700 hover:border-gray-500 font-medium transition"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 font-medium transition"
              >
                Generate Course
              </button>
            </div>
          </div>
        )}

        {/* Generating */}
        {step === "generating" && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Building Your Course</h2>
            <p className="text-gray-500 mb-8">
              AI is generating {config.sections} sections with{" "}
              {config.aiLevel} content...
            </p>
            <div className="max-w-sm mx-auto space-y-3">
              {[
                "Analyzing topic and difficulty...",
                "Creating course structure...",
                "Generating section content...",
                "Creating featured images...",
              ].map((task, i) => (
                <div
                  key={task}
                  className="flex items-center gap-3 text-sm text-gray-400"
                  style={{ animationDelay: `${i * 0.8}s` }}
                >
                  <div className="w-4 h-4 rounded-full bg-purple-500/20 animate-pulse" />
                  {task}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete */}
        {step === "complete" && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
              <Icon d="M5 13l4 4L19 7" className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Course Generated!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              &quot;{config.title}&quot; has been created with {config.sections}{" "}
              sections
              {config.generateImages ? " and AI-generated featured images" : ""}
              .
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setStep("details");
                  setConfig({
                    title: "",
                    description: "",
                    contentType: "text-course",
                    difficulty: "intermediate",
                    sections: 8,
                    aiLevel: "moderate",
                    uploadedFiles: [],
                    generateImages: true,
                  });
                }}
                className="px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-500 font-medium transition"
              >
                Build Another
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 font-medium transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
