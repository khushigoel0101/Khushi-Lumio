import { useState } from "react";
import SummaryGenerator from "../components/SummaryGenerator";
import SummaryEditor from "../components/SummaryEditor";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="w-1/3 bg-gray-100 p-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Transcript</h2>
        <textarea
          className="w-full p-2 border rounded resize-none"
          rows={8}
          placeholder="Paste your transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />

        <h2 className="text-lg font-semibold">Prompt</h2>
        <textarea
          className="w-full p-2 border rounded resize-none"
          rows={4}
          placeholder="e.g. Summarize in bullet points for executives..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Generate Button */}
        <SummaryGenerator
          transcript={transcript}
          prompt={prompt}
          onSummaryGenerated={setSummary}
        />
      </div>

      {/* Right Panel */}
      <div className="w-2/3 p-6">
        <SummaryEditor summary={summary} setSummary={setSummary} />
      </div>
    </div>
  );
}
