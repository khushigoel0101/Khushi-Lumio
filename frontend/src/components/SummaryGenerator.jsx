import { useState } from "react";
import { generateSummary } from "../services/api";
import { ArrowPathIcon } from "@heroicons/react/24/outline"; // loading spinner

export default function SummaryGenerator({ transcript, prompt, onSummaryGenerated }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      alert("Please enter a transcript first.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateSummary(transcript, prompt);
      onSummaryGenerated(res.summary); 
    } catch (err) {
      console.error(err);
      alert("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <ArrowPathIcon className="w-5 h-5 animate-spin" />
          Generating...
        </>
      ) : (
        "Get AI powered notes"
      )}
    </button>
  );
}
