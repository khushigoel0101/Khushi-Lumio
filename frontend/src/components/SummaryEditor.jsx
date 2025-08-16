import { useState } from "react";
import { sendEmail } from "../services/api";

export default function SummaryEditor({ summary, setSummary }) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Meeting Summary");
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    try {
      setStatus("Sending...");
      await sendEmail({
        to: email,
        subject,
        text: summary,
        html: `<p>${summary.replace(/\n/g, "<br/>")}</p>`,
      });
      setStatus("✅ Email sent!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send email");
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg shadow bg-white">
      <h2 className="text-lg font-semibold">Generated Summary</h2>

      {/* Editable text area */}
      <textarea
        className="w-full h-40 p-2 border rounded resize-none"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      {/* Email input */}
      <input
        type="email"
        placeholder="Recipient Email"
        className="p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Subject input */}
      <input
        type="text"
        placeholder="Email Subject"
        className="p-2 border rounded"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Send Email
      </button>

      {/* Status */}
      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}
