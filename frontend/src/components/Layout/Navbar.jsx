import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("authToken");

  let initial = "U";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.fullName) {
        initial = decoded.fullName.charAt(0).toUpperCase();
      } else if (decoded.email) {
        initial = decoded.email.charAt(0).toUpperCase();
      }
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Meetings", path: "/meetings" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LEFT: Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer text-lg font-bold text-slate-900"
        >
          MeetAI
        </div>

        {/* CENTER: Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          
          {/* New Button */}
          <button
            onClick={() => navigate("/generate")}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            + New
          </button>

          {/* Avatar */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700"
            >
              {initial}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border bg-white shadow-lg">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;