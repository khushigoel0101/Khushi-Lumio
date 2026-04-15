import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "../components/Layout/AppLayout";
import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  DocumentArrowUpIcon,
  PencilSquareIcon,
  BoltIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";



import API from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    navigate("/generate", {
      state: { uploadedFile: file },
    });

    e.target.value = "";
  };

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/api/meetings");
      setMeetings(Array.isArray(res.data?.meetings) ? res.data.meetings : []);
    } catch (err) {
      console.error("Fetch meetings error:", err);
      setError("Failed to load meetings.");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const {
    totalMeetings,
    totalSummaries,
    totalActionItems,
    totalDecisions,
    latestActionItems,
    latestDecisions,
    recentMeetings,
    completionRate,
    pendingMeetings,
    latestMeeting,
  } = useMemo(() => {
    const safeMeetings = Array.isArray(meetings) ? meetings : [];

    const totalMeetings = safeMeetings.length;

    const totalSummaries = safeMeetings.filter(
      (m) => m.summary && String(m.summary).trim() !== ""
    ).length;

    const totalActionItems = safeMeetings.reduce(
      (total, m) => total + (Array.isArray(m.actionItems) ? m.actionItems.length : 0),
      0
    );

    const totalDecisions = safeMeetings.reduce(
      (total, m) => total + (Array.isArray(m.decisions) ? m.decisions.length : 0),
      0
    );

    const sortedMeetings = [...safeMeetings].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.meetingDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.meetingDate || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    const latestMeeting = sortedMeetings[0] || null;

    const latestActionItems = sortedMeetings
      .flatMap((meeting) =>
        (meeting.actionItems || []).map((item, index) => ({
          id: `${meeting._id || meeting.title || "meeting"}-action-${index}`,
          text: typeof item === "string" ? item : item?.text || "Untitled action item",
          meetingTitle: meeting.title || "Untitled Meeting",
        }))
      )
      .slice(0, 5);

    const latestDecisions = sortedMeetings
      .flatMap((meeting) =>
        (meeting.decisions || []).map((item, index) => ({
          id: `${meeting._id || meeting.title || "meeting"}-decision-${index}`,
          text: typeof item === "string" ? item : item?.text || "Untitled decision",
          meetingTitle: meeting.title || "Untitled Meeting",
        }))
      )
      .slice(0, 5);

    const recentMeetings = sortedMeetings.slice(0, 5);

    const completionRate =
      totalMeetings === 0 ? 0 : Math.round((totalSummaries / totalMeetings) * 100);

    const pendingMeetings = safeMeetings.filter((m) => {
      const status = (m.status || "").toLowerCase();
      return status === "draft" || status === "pending";
    }).length;

    return {
      totalMeetings,
      totalSummaries,
      totalActionItems,
      totalDecisions,
      latestActionItems,
      latestDecisions,
      recentMeetings,
      completionRate,
      pendingMeetings,
      latestMeeting,
    };
  }, [meetings]);

  const stats = [
    {
      title: "Total Meetings",
      value: totalMeetings,
      helper: latestMeeting ? "All stored meetings" : "No meetings yet",
      icon: CalendarDaysIcon,
    },
    {
      title: "Summaries",
      value: totalSummaries,
      helper: `${completionRate}% completion rate`,
      icon: SparklesIcon,
    },
    {
      title: "Action Items",
      value: totalActionItems,
      helper: latestActionItems.length ? "Latest tasks extracted" : "No tasks yet",
      icon: ClipboardDocumentListIcon,
    },
    {
      title: "Decisions",
      value: totalDecisions,
      helper: pendingMeetings ? `${pendingMeetings} pending meetings` : "Up to date",
      icon: CheckCircleIcon,
    },
  ];

  const quickActions = [
    {
      title: "Upload Transcript",
      subtitle: "PDF, DOCX, TXT",
      icon: DocumentArrowUpIcon,
      onClick: handleUploadClick,
    },
    {
      title: "Paste Notes",
      subtitle: "Manual meeting text",
      icon: PencilSquareIcon,
      onClick: () => navigate("/generate"),
    },
    {
      title: "Generate Summary",
      subtitle: "AI meeting insights",
      icon: BoltIcon,
      onClick: () => navigate("/generate"),
    },
  ];

  const formatDate = (date) => {
    if (!date) return "No date";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "No date";
    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClasses = (status) => {
    const normalized = (status || "draft").toLowerCase();

    if (normalized === "completed") {
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    }

    if (normalized === "pending") {
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    }

    return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  };

  const getSummaryPreview = (summary) => {
    if (!summary || !String(summary).trim()) return "No summary generated yet.";
    const clean = String(summary).trim();
    return clean.length > 110 ? `${clean.slice(0, 110)}...` : clean;
  };

  return (
      <AppLayout>
      <div className="flex-1">
        

        <main className="space-y-7 p-4 sm:p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />

          <section className="rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 p-6 text-white shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-amber-100">
                  Meeting Assistant Dashboard
                </p>
                <h1 className="text-2xl font-bold sm:text-3xl">Welcome back</h1>
                <p className="mt-3 text-sm leading-6 text-amber-100 sm:text-base">
                  Track meetings, review summaries, monitor action items, and keep
                  every follow-up in one clean workspace.
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                      <h3 className="mt-2 text-3xl font-bold text-slate-900">
                        {stat.value}
                      </h3>
                    </div>

                    <div className="rounded-xl bg-amber-50 p-2 text-amber-700">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
                </div>
              );
            })}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              <p className="text-sm text-slate-500">Jump into your workflow</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.title}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={`rounded-2xl border p-4 text-left transition duration-200 ${
                      action.disabled
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                        : "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50 hover:shadow-sm"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="rounded-xl bg-slate-100 p-2">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      {!action.disabled && (
                        <ArrowRightIcon className="h-4 w-4 text-slate-400" />
                      )}
                    </div>

                    <h3 className="font-semibold text-slate-900">{action.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{action.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent Meetings</h2>
                <button
                  onClick={() => navigate("/meetings")}
                  className="text-sm font-medium text-amber-700 hover:text-amber-800 hover:underline"
                >
                  View all
                </button>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                  Loading meetings...
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              ) : recentMeetings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                  <h3 className="text-base font-semibold text-slate-800">
                    No meetings yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Upload a transcript or paste meeting notes to generate your first summary.
                  </p>
                  <button
                    onClick={handleUploadClick}
                    className="mt-4 rounded-xl bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 active:scale-[0.99]"
                  >
                    Get started
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMeetings.map((meeting) => (
                    <div
                      key={meeting._id}
                      className="rounded-2xl border border-slate-200 p-4 transition duration-200 hover:border-slate-300 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold text-slate-900">
                            {meeting.title || "Untitled Meeting"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatDate(meeting.meetingDate || meeting.createdAt)}
                          </p>
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {getSummaryPreview(meeting.summary)}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              {meeting.actionItems?.length || 0} action items
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              {meeting.decisions?.length || 0} decisions
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              {meeting.summary ? "Summary ready" : "No summary"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                              meeting.status
                            )}`}
                          >
                            {meeting.status || "draft"}
                          </span>

                          <button
                            onClick={() => navigate(`/meetings/${meeting._id}`)}
                            className="text-sm font-medium text-amber-700 hover:text-amber-800 hover:underline"
                          >
                            Open
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  Latest Decisions
                </h2>

                {latestDecisions.length === 0 ? (
                  <p className="text-sm text-slate-500">No decisions extracted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {latestDecisions.map((decision) => (
                      <div
                        key={decision.id}
                        className="rounded-xl bg-slate-50 p-3"
                      >
                        <p className="text-sm font-medium text-slate-800">
                          {decision.text}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {decision.meetingTitle}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  Latest Action Items
                </h2>

                {latestActionItems.length === 0 ? (
                  <p className="text-sm text-slate-500">No action items extracted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {latestActionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-xl bg-slate-50 p-3"
                      >
                        <input type="checkbox" className="mt-1" readOnly />
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {item.text}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.meetingTitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </AppLayout>
  );
};

export default Dashboard;