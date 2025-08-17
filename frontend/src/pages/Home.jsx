import { useState } from "react";
import SummaryGenerator from "../components/SummaryGenerator";
import SummaryEditor from "../components/SummaryEditor";
import { ClipboardIcon, PencilIcon } from "@heroicons/react/24/outline";

function InputSection({ label, value, onChange, rows, placeholder, icon: Icon }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        {Icon && <Icon className="w-5 h-5" />}
        <span className="font-semibold">{label}</span>
      </div>
      <textarea
        className="w-full p-4 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");

  const handleChange = (setter) => (e) => setter(e.target.value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 flex flex-col lg:flex-row p-4 lg:p-6 gap-4 lg:gap-6">
      {/* Left Panel */}
      <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-4 lg:p-6 flex flex-col gap-4 lg:gap-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Notes</h1>

        <InputSection
          label="Transcript"
          icon={ClipboardIcon}
          value={transcript}
          onChange={handleChange(setTranscript)}
          rows={8}
          placeholder="Paste your transcript here..."
        />

        <InputSection
          label="Prompt"
          icon={PencilIcon}
          value={prompt}
          onChange={handleChange(setPrompt)}
          rows={4}
          placeholder="Summarize in bullet points for executives..."
        />

        <SummaryGenerator
          transcript={transcript}
          prompt={prompt}
          onSummaryGenerated={setSummary}
        />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-4 lg:p-6 h-full flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Summary
          </h2>
          <SummaryEditor summary={summary} setSummary={setSummary} />
        </div>
      </div>
    </div>
  );
}
