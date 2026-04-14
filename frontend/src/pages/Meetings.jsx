import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import AppLayout from "../components/Layout/AppLayout";

const Meetings = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      if (id) {
        const res = await API.get(`/api/meetings/${id}`);
        const meeting = res.data?.meeting || res.data?.data || res.data;

        if (meeting) {
          setMeetings([meeting]);
          setExpandedId(meeting._id);
        } else {
          setMeetings([]);
        }
      } else {
        const res = await API.get("/api/meetings");
        const allMeetings = Array.isArray(res.data?.meetings)
          ? res.data.meetings
          : [];

        setMeetings(allMeetings);
      }
    } catch (err) {
      console.error("Fetch meetings error:", err);
      setError(id ? "Failed to load this meeting." : "Failed to load meetings.");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [id]);

  const handleDelete = async (meetingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/api/meetings/${meetingId}`);

      if (id && meetingId === id) {
        navigate("/meetings");
        return;
      }

      setMeetings((prev) => prev.filter((meeting) => meeting._id !== meetingId));

      if (expandedId === meetingId) {
        setExpandedId(null);
      }
    } catch (err) {
      console.error("Delete meeting error:", err);
      alert("Failed to delete meeting.");
    }
  };

  const toggleExpand = (meetingId) => {
    setExpandedId((prev) => (prev === meetingId ? null : meetingId));
  };

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

  const filteredMeetings = useMemo(() => {
    const safeMeetings = Array.isArray(meetings) ? meetings : [];

    const filtered = safeMeetings.filter((meeting) => {
      const actionItemsText = Array.isArray(meeting.actionItems)
        ? meeting.actionItems
            .map((item) => (typeof item === "string" ? item : item?.text || ""))
            .join(" ")
        : "";

      const decisionsText = Array.isArray(meeting.decisions)
        ? meeting.decisions
            .map((item) => (typeof item === "string" ? item : item?.text || ""))
            .join(" ")
        : "";

      const combinedText = `
        ${meeting.title || ""}
        ${meeting.summary || ""}
        ${actionItemsText}
        ${decisionsText}
        ${meeting.status || ""}
      `.toLowerCase();

      return combinedText.includes(search.toLowerCase());
    });

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(
        a.updatedAt || a.meetingDate || a.createdAt || 0
      ).getTime();
      const dateB = new Date(
        b.updatedAt || b.meetingDate || b.createdAt || 0
      ).getTime();

      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [meetings, search, sortBy]);

  return (
    
      <AppLayout>

      <div className="flex-1">
        

        <main className="space-y-6 p-4 sm:p-6">
          <section className="rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 p-6 text-white shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-amber-100">
                  Meeting History
                </p>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {id ? "Meeting Details" : "All Meetings"}
                </h1>
                <p className="mt-3 text-sm leading-6 text-amber-100 sm:text-base">
                  {id
                    ? "Review the full saved meeting summary, action items, and decisions."
                    : "Browse saved meetings, review summaries, and manage action items and decisions in one place."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {id && (
                  <button
                    onClick={() => navigate("/meetings")}
                    className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Back to All Meetings
                  </button>
                )}

                <button
                  onClick={() => navigate("/generate")}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.01]"
                >
                  New Meeting
                </button>
              </div>
            </div>
          </section>

          {!id && (
            <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <input
                  type="text"
                  placeholder="Search by title, summary, action items, decisions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 md:flex-1"
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 md:w-52"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </section>
          )}

          {loading ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Loading meetings...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <h3 className="text-base font-semibold text-slate-800">
                No meetings found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Your saved meetings will appear here.
              </p>
            </div>
          ) : (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredMeetings.map((meeting) => {
                const isExpanded = id ? true : expandedId === meeting._id;
                const displayDate =
                  meeting.updatedAt || meeting.meetingDate || meeting.createdAt;

                return (
                  <div
                    key={meeting._id}
                    className={`${id ? "md:col-span-2 xl:col-span-3" : ""} rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-slate-900">
                          {meeting.title || "Untitled Meeting"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(displayDate)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                          meeting.status
                        )}`}
                      >
                        {meeting.status || "draft"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-800">
                        Summary
                      </h4>
                      <p
                        className={`mt-2 text-sm leading-6 text-slate-600 ${
                          isExpanded ? "" : "line-clamp-4"
                        }`}
                      >
                        {meeting.summary || "No summary generated yet."}
                      </p>
                    </div>

                    {Array.isArray(meeting.actionItems) &&
                      meeting.actionItems.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-slate-800">
                            Action Items
                          </h4>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                            {(isExpanded
                              ? meeting.actionItems
                              : meeting.actionItems.slice(0, 2)
                            ).map((item, index) => (
                              <li key={index}>
                                {typeof item === "string"
                                  ? item
                                  : item?.text || "Untitled action item"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {isExpanded &&
                      Array.isArray(meeting.decisions) &&
                      meeting.decisions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-slate-800">
                            Decisions
                          </h4>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                            {meeting.decisions.map((item, index) => (
                              <li key={index}>
                                {typeof item === "string"
                                  ? item
                                  : item?.text || "Untitled decision"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {!id && (
                        <button
                          onClick={() => toggleExpand(meeting._id)}
                          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                        >
                          {isExpanded ? "View Less" : "View More"}
                        </button>
                      )}

                      {!id && (
                        <button
                          onClick={() => navigate(`/meetings/${meeting._id}`)}
                          className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
                        >
                          Open
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(meeting._id)}
                        className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </main>
      </div>
      </AppLayout>
  );
};

export default Meetings;