import { useState, useEffect } from "react";
import SummaryGenerator from "../components/Summary/SummaryGenerator";
import SummaryEditor from "../components/Summary/SummaryEditor";
import { login as loginApi, register as registerApi, logout as logoutApi, validateToken } from "../services/api";
import { ClipboardIcon, PencilIcon } from "@heroicons/react/24/outline";


function InputSection({ label, value, onChange, rows, placeholder, icon: Icon }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        {Icon && <Icon className="w-5 h-5" />}
        <span className="font-semibold">{label}</span>
      </div>
      <textarea
        className="w-full p-4 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function AuthField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
      />
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const valid = await validateToken();
        setIsLoggedIn(valid);
      } catch (error) {
        setIsLoggedIn(false);
        logoutApi();
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleChange = (setter) => (e) => setter(e.target.value);

  const handleAuth = async () => {
    setAuthError("");
    setAuthMessage("");

    try {
      if (authMode === "register") {
        await registerApi({ email, password });
        setAuthMessage("Account created and logged in.");
      } else {
        await loginApi({ email, password });
        setAuthMessage("Logged in successfully.");
      }
      setIsLoggedIn(true);
    } catch (err) {
      setIsLoggedIn(false);
      setAuthError(authMode === "register" ? "Registration failed." : "Login failed. Check your credentials.");
    }
  };

  const handleLogout = () => {
    logoutApi();
    setIsLoggedIn(false);
    setAuthMessage("Logged out.");
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-gray-100 dark:from-amber-950 dark:via-amber-800 flex flex-col lg:flex-row p-4 lg:p-6 gap-4 lg:gap-6">

      {/* Left Panel */}
      <div className="w-full lg:w-1/3 bg-white dark:bg-gray-950 rounded-3xl shadow-lg p-4 lg:p-6 flex flex-col gap-4 lg:gap-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Notes</h1>
        
        <div className="space-y-4">
          {authLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Checking login status...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {authMode === "register" ? "Create account" : "Login"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === "register" ? "login" : "register");
                      setAuthError("");
                      setAuthMessage("");
                    }}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {authMode === "register" ? "Switch to login" : "Switch to register"}
                  </button>
                </div>
                {isLoggedIn && <p className="text-sm text-green-500">Logged in</p>}
              </div>
              
              <AuthField
                label="Email"
                value={email}
                onChange={handleChange(setEmail)}
                placeholder="you@example.com"
                type="email"
              />
              <AuthField
                label="Password"
                value={password}
                onChange={handleChange(setPassword)}
                placeholder="Your password"
                type="password"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAuth}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  {authMode === "register" ? "Create account" : "Login"}
                </button>
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm text-gray-700 dark:text-gray-200 hover:underline"
                  >
                    Logout
                  </button>
                )}
              </div>
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              {authMessage && <p className="text-sm text-green-500">{authMessage}</p>}
            </>
          )}
        </div>

        <InputSection
          label="Transcript"
          icon={ClipboardIcon}
          value={transcript}
          onChange={handleChange(setTranscript)}
          rows={8}
          placeholder="Paste your transcript here..."
        />

        <InputSection
          label="Prompt"
          icon={PencilIcon}
          value={prompt}
          onChange={handleChange(setPrompt)}
          rows={4}
          placeholder="Summarize in bullet points for executives..."
        />

        <SummaryGenerator
          transcript={transcript}
          prompt={prompt}
          onSummaryGenerated={setSummary}
          disabled={!isLoggedIn}
        />
        {!isLoggedIn && !authLoading && (
          <p className="text-sm text-gray-600 dark:text-gray-400">Please log in to generate summaries.</p>
        )}
      </div>
      

      {/* Right Panel */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-4 lg:p-6 h-full flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Summary
          </h2>
          <SummaryEditor summary={summary} setSummary={setSummary} />
          
        </div>
      </div>
    </div>
  );
}
