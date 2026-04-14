import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/Layout/AppLayout";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const storedName =
      localStorage.getItem("fullName") ||
      localStorage.getItem("userName") ||
      localStorage.getItem("name") ||
      "";

    const storedEmail =
      localStorage.getItem("email") ||
      localStorage.getItem("userEmail") ||
      "";

    setUser({
      name: storedName,
      email: storedEmail,
    });
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/api/meetings");
      setMeetings(Array.isArray(res.data?.meetings) ? res.data.meetings : []);
    } catch (err) {
      console.error("Fetch meetings error:", err);
      setError("Failed to load profile activity.");
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
    completionRate,
    pendingMeetings,
    recentMeetings,
    latestMeetingDate,
  } = useMemo(() => {
    const safeMeetings = Array.isArray(meetings) ? meetings : [];

    const totalMeetings = safeMeetings.length;

    const totalSummaries = safeMeetings.filter(
      (m) => m.summary && String(m.summary).trim() !== ""
    ).length;

    const totalActionItems = safeMeetings.reduce(
      (total, m) =>
        total + (Array.isArray(m.actionItems) ? m.actionItems.length : 0),
      0
    );

    const totalDecisions = safeMeetings.reduce(
      (total, m) =>
        total + (Array.isArray(m.decisions) ? m.decisions.length : 0),
      0
    );

    const sortedMeetings = [...safeMeetings].sort((a, b) => {
      const dateA = new Date(
        a.updatedAt || a.meetingDate || a.createdAt || 0
      ).getTime();
      const dateB = new Date(
        b.updatedAt || b.meetingDate || b.createdAt || 0
      ).getTime();
      return dateB - dateA;
    });

    const recentMeetings = sortedMeetings.slice(0, 4);

    const completionRate =
      totalMeetings === 0 ? 0 : Math.round((totalSummaries / totalMeetings) * 100);

    const pendingMeetings = safeMeetings.filter((m) => {
      const status = (m.status || "").toLowerCase();
      return status === "draft" || status === "pending";
    }).length;

    const latestMeetingDate =
      sortedMeetings[0]?.updatedAt ||
      sortedMeetings[0]?.meetingDate ||
      sortedMeetings[0]?.createdAt ||
      null;

    return {
      totalMeetings,
      totalSummaries,
      totalActionItems,
      totalDecisions,
      completionRate,
      pendingMeetings,
      recentMeetings,
      latestMeetingDate,
    };
  }, [meetings]);

  const formatDate = (date) => {
    if (!date) return "No activity yet";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "No activity yet";

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getInitial = () => {
    if (user.name?.trim()) return user.name.trim().charAt(0).toUpperCase();
    if (user.email?.trim()) return user.email.trim().charAt(0).toUpperCase();
    return "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const stats = [
    {
      title: "Total Meetings",
      value: totalMeetings,
      helper: "Meetings saved in your workspace",
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
      helper: "Tasks extracted from meetings",
      icon: ClipboardDocumentListIcon,
    },
    {
      title: "Decisions",
      value: totalDecisions,
      helper: pendingMeetings
        ? `${pendingMeetings} meetings still pending`
        : "Everything looks up to date",
      icon: CheckCircleIcon,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-semibold text-white">
                  {getInitial()}
                </div>

                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">
                    {user.name || "Your Profile"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage your account and track your meeting activity
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
              <div className="mb-4 flex items-center gap-2">
                <UserCircleIcon className="h-5 w-5 text-slate-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  User Info
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Full Name
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {user.name || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900">
                      {user.email || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <CalendarDaysIcon className="h-5 w-5 text-slate-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Account Activity
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Last Activity
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {formatDate(latestMeetingDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Saved Meetings
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {totalMeetings}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Summary Completion
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {completionRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </h3>
                  </div>

                  <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">{stat.helper}</p>
              </div>
            );
          })}
        </section>
        
      </div>
    </AppLayout>
  );
};

export default Profile;