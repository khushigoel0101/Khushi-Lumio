import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

const Generate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const uploadedFile = location.state?.uploadedFile || null;
  const localFileInputRef = useRef(null);

  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(uploadedFile);

  const [meetingTitle, setMeetingTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState([]);
  const [decisions, setDecisions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("Meeting Summary");
  const [emailMessage, setEmailMessage] = useState(
    "Hi,\n\nPlease find the meeting summary below.\n"
  );

  useEffect(() => {
    if (uploadedFile) {
      setSelectedFile(uploadedFile);
      setSuccessMessage(`File selected: ${uploadedFile.name}`);
    }
  }, [uploadedFile]);

  const hasResult = useMemo(() => {
    return Boolean(summary || actionItems.length || decisions.length);
  }, [summary, actionItems, decisions]);

  const buildEmailBody = () => {
    const actionsText =
      actionItems.length > 0
        ? actionItems.map((item) => `- ${item}`).join("\n")
        : "Not mentioned";

    const decisionsText =
      decisions.length > 0
        ? decisions.map((item) => `- ${item}`).join("\n")
        : "Not mentioned";

    return `${emailMessage}

Summary:
${summary || "Not mentioned"}

Action Items:
${actionsText}

Decisions:
${decisionsText}
`;
  };

  const resetOutput = () => {
    setSummary("");
    setActionItems([]);
    setDecisions([]);
  };

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
    setEmailSuccess("");
  };

  const handleLocalFilePick = () => {
    localFileInputRef.current?.click();
  };

  const handleLocalFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    clearMessages();
    setSuccessMessage(`File selected: ${file.name}`);
    e.target.value = "";
  };

  const saveMeeting = async ({
    title,
    transcript = "",
    summary = "",
    actionItems = [],
    decisions = [],
  }) => {
    await API.post("/api/meetings", {
      title,
      transcript,
      summary,
      actionItems,
      decisions,
      status: "completed",
      meetingDate: new Date().toISOString(),
    });
  };

  const handleGenerateFromText = async () => {
    if (!meetingTitle.trim()) {
      setError("Please enter a meeting title.");
      return;
    }

    if (!text.trim()) {
      setError("Please paste some meeting notes first.");
      return;
    }

    try {
      clearMessages();
      resetOutput();
      setLoading(true);

      const res = await API.post("/api/ai/summarize", { text });

      const generatedSummary = res.data.summary || "";
      const generatedActionItems = res.data.actionItems || [];
      const generatedDecisions = res.data.decisions || [];

      setSummary(generatedSummary);
      setActionItems(generatedActionItems);
      setDecisions(generatedDecisions);

      await saveMeeting({
        title: meetingTitle,
        transcript: text,
        summary: generatedSummary,
        actionItems: generatedActionItems,
        decisions: generatedDecisions,
      });

      setSuccessMessage("Summary generated and saved successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to generate summary from text."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromFile = async () => {
    if (!meetingTitle.trim()) {
      setError("Please enter a meeting title.");
      return;
    }

    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    try {
      clearMessages();
      resetOutput();
      setLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await API.post("/api/ai/summarize-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const generatedSummary = res.data.summary || "";
      const generatedActionItems = res.data.actionItems || [];
      const generatedDecisions = res.data.decisions || [];

      setSummary(generatedSummary);
      setActionItems(generatedActionItems);
      setDecisions(generatedDecisions);

      await saveMeeting({
        title: meetingTitle,
        transcript: "",
        summary: generatedSummary,
        actionItems: generatedActionItems,
        decisions: generatedDecisions,
      });

      setSuccessMessage("Summary generated from file and saved successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to generate summary from file."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!hasResult) return;

    const textToCopy = `Summary:
${summary || "Not mentioned"}

Action Items:
${
  actionItems.length
    ? actionItems.map((item) => `- ${item}`).join("\n")
    : "Not mentioned"
}

Decisions:
${
  decisions.length
    ? decisions.map((item) => `- ${item}`).join("\n")
    : "Not mentioned"
}
`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      clearMessages();
      setSuccessMessage("Summary copied to clipboard.");
    } catch (err) {
      console.error(err);
      setError("Could not copy summary.");
    }
  };

  const handleClearAll = () => {
    setText("");
    setSelectedFile(null);
    setMeetingTitle("");
    resetOutput();
    clearMessages();
  };

  const handleSendEmail = async () => {
    if (!emailTo.trim()) {
      setError("Please enter a recipient email.");
      return;
    }

    if (!hasResult) {
      setError("Generate a summary before sending email.");
      return;
    }

    try {
      setSendingEmail(true);
      setError("");
      setEmailSuccess("");

      await API.post("/api/email/send", {
        to: emailTo,
        subject: emailSubject.trim() || "Meeting Summary",
        text: buildEmailBody(),
      });

      setEmailSuccess("Summary emailed successfully.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to send email."
      );
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Generate Meeting Summary
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Paste notes or upload a file, generate the result, and share it by email.
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {(error || successMessage || emailSuccess) && (
          <div className="mb-6 space-y-3">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            {emailSuccess && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {emailSuccess}
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          <section className="border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Meeting Details
              </h2>
            </div>

            <div className="p-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Meeting Title
              </label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Enter meeting title"
                className="w-full border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-600"
              />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Paste Notes</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Paste meeting transcript or notes directly.
                  </p>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
                  Text
                </span>
              </div>

              <div className="p-5">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your meeting notes here..."
                  className="h-72 w-full border border-slate-300 p-4 text-sm text-slate-800 outline-none transition focus:border-amber-600"
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleGenerateFromText}
                    disabled={loading || !text.trim()}
                    className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Generate from Text"}
                  </button>

                  <button
                    onClick={() => setText("")}
                    disabled={loading || !text}
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Clear Text
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Upload File</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Upload a supported text-based file to summarize.
                  </p>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-600">
                  TXT, MD, JSON, XML, CSV
                </span>
              </div>

              <div className="p-5">
                <input
                  ref={localFileInputRef}
                  type="file"
                  accept=".txt,.md,.json,.xml,.csv"
                  className="hidden"
                  onChange={handleLocalFileChange}
                />

                {selectedFile ? (
                  <div className="border border-slate-300 bg-slate-50 px-4 py-4">
                    <p className="text-sm font-medium text-slate-800">
                      {selectedFile.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      File selected and ready for summarization.
                    </p>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-300 px-4 py-8 text-center">
                    <p className="text-sm text-slate-600">No file selected yet.</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Choose a supported file to continue.
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={handleLocalFilePick}
                    disabled={loading}
                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Choose File
                  </button>

                  <button
                    onClick={handleGenerateFromFile}
                    disabled={loading || !selectedFile}
                    className="rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Generate from File"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {hasResult && (
            <>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopy}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Copy Result
                </button>

                <button
                  onClick={handleClearAll}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Clear All
                </button>
              </div>

              <section className="border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Generated Output
                  </h2>
                </div>

                <div className="grid gap-0 lg:grid-cols-3">
                  <div className="border-b border-slate-200 p-5 lg:col-span-2 lg:border-b-0 lg:border-r">
                    <h3 className="text-base font-semibold text-slate-900">Summary</h3>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {summary || "No summary available."}
                    </p>
                  </div>

                  <div className="divide-y divide-slate-200">
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-slate-900">
                        Action Items
                      </h3>

                      {actionItems.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-500">No action items.</p>
                      ) : (
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                          {actionItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-semibold text-slate-900">
                        Decisions
                      </h3>

                      {decisions.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-500">No decisions.</p>
                      ) : (
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                          {decisions.map((decision, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1">•</span>
                              <span>{decision}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Share by Email
                  </h2>
                </div>

                <div className="space-y-5 p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Recipient Email
                      </label>
                      <input
                        type="email"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Intro Message
                    </label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      className="h-28 w-full border border-slate-300 p-4 text-sm text-slate-800 outline-none transition focus:border-amber-600"
                    />
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Preview
                    </p>
                    <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {buildEmailBody()}
                    </pre>
                  </div>

                  <div>
                    <button
                      onClick={handleSendEmail}
                      disabled={sendingEmail || !hasResult}
                      className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sendingEmail ? "Sending..." : "Send Email"}
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;