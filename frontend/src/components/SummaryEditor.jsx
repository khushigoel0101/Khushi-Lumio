import { useState } from "react";
import { sendEmail } from "../services/api";
import { PaperAirplaneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function SummaryEditor({ summary, setSummary }) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Meeting Summary");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      alert("Please enter recipient email");
      return;
    }
    setLoading(true);
    try {
      setStatus("Sending...");
      await sendEmail({
        to: email,
        subject,
        text: summary,
        html: `<p>${summary.replace(/\n/g, "<br/>")}</p>`,
      });
      setStatus(" Email sent!");
    } catch (err) {
      console.error(err);
      setStatus(" Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Generated Summary</h2>

      <textarea
        className="w-full p-4 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-400 outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={6}
        placeholder="Edit your summary here..."
      />

      <input
        type="email"
        placeholder="Enter the Recipient mail id seperated with commas(,)"
        className="w-full p-3 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-400 outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Email Subject"
        className="w-full p-3 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-400 outline-none bg-gray-50 dark:bg-gray-700 dark:text-gray-100 transition"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PaperAirplaneIcon className="w-5 h-5" />}
        {loading ? "Sending..." : "Send Email"}
      </button>

      {status && <p className="text-sm text-gray-700 dark:text-gray-200">{status}</p>}
    </div>
  );
}
