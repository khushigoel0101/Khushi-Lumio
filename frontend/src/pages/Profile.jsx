import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/Layout/AppLayout";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      setUser({
        fullName:
          decoded.fullName ||
          decoded.name ||
          decoded.user?.fullName ||
          decoded.user?.name ||
          "",
        email:
          decoded.email ||
          decoded.user?.email ||
          "",
      });
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/api/meetings");
        setMeetings(Array.isArray(res.data?.meetings) ? res.data.meetings : []);
      } catch (err) {
        console.error("Fetch meetings error:", err);
        setError("Failed to load profile data.");
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const {
    totalMeetings,
    totalSummaries,
    totalActionItems,
    totalDecisions,
    completionRate,
    latestMeetingDate,
    thisMonthMeetings,
  } = useMemo(() => {
    const safeMeetings = Array.isArray(meetings) ? meetings : [];

    const totalMeetings = safeMeetings.length;

    const totalSummaries = safeMeetings.filter(
      (m) => m.summary && String(m.summary).trim() !== ""
    ).length;

    const totalActionItems = safeMeetings.reduce(
      (acc, m) => acc + (Array.isArray(m.actionItems) ? m.actionItems.length : 0),
      0
    );

    const totalDecisions = safeMeetings.reduce(
      (acc, m) => acc + (Array.isArray(m.decisions) ? m.decisions.length : 0),
      0
    );

    const sortedMeetings = [...safeMeetings].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    const latestMeetingDate =
      sortedMeetings[0]?.updatedAt ||
      sortedMeetings[0]?.createdAt ||
      null;

    const completionRate =
      totalMeetings === 0 ? 0 : Math.round((totalSummaries / totalMeetings) * 100);

    const now = new Date();
    const thisMonthMeetings = safeMeetings.filter((m) => {
      const d = new Date(m.createdAt || m.updatedAt);
      return (
        !Number.isNaN(d.getTime()) &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }).length;

    return {
      totalMeetings,
      totalSummaries,
      totalActionItems,
      totalDecisions,
      completionRate,
      latestMeetingDate,
      thisMonthMeetings,
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

  const getInitials = () => {
    if (user.fullName?.trim()) {
      const parts = user.fullName.trim().split(" ").filter(Boolean);
      if (parts.length === 1) return parts[0][0].toUpperCase();
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    if (user.email?.trim()) return user.email[0].toUpperCase();

    return "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };


  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-8 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white ring-1 ring-white/20">
                  {getInitials()}
                </div>

                <div>
                  <h1 className="text-2xl font-semibold">
                    {user.fullName || "Your Profile"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-300">
                    View your account details and meeting insights
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
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
                  Account Info
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Full Name
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {user.fullName || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email Address
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900">
                      {user.email || "Not available"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Account Status
                  </p>
                  <p className="mt-1 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    Active
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-slate-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Overview
                </h2>
              </div>

              <div className="space-y-5">
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
                    Meetings This Month
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {thisMonthMeetings}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Summary Completion
                  </p>
                  <div className="mt-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {completionRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;