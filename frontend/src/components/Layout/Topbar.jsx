import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

 
  const getTitle = () => {
    if (location.pathname.startsWith("/generate")) return "Generate Summary";
    if (location.pathname.startsWith("/meetings")) return "Meetings";
    if (location.pathname.startsWith("/profile")) return "Profile";
    return "Dashboard";
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Title */}
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {getTitle()}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          
          {/* New Meeting Button */}
          <button
            onClick={() => navigate("/generate")}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            + New
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700"
            >
              U
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
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

export default Topbar;