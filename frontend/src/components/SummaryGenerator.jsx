import axios from "axios";
import { useState } from "react";

export default function SummaryGenerator({ transcript, prompt, onSummaryGenerated }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      alert("Please enter a transcript first.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/summarize", {
        text: transcript,
        prompt,
      });
      onSummaryGenerated(res.data.summary);
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
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Generating..." : "Generate Summary"}
    </button>
  );
}
