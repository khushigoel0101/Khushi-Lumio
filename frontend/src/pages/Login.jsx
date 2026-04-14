import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthLayout from "../components/auth/AuthLayout";
import AuthField from "../components/auth/AuthField";
import loginImg from "../assets/undraw_authentication_1evl.svg";
import { login as loginApi, googleLogin as googleLoginApi } from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      await loginApi({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");

      if (!credentialResponse?.credential) {
        setError("Google login failed.");
        return;
      }

      await googleLoginApi(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Google login failed.");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue to your AI Meeting Assistant dashboard."
      image={loginImg}
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <AuthField
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={setEmail}
        />
        <AuthField
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={setPassword}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-600 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/30"></div>
        <span className="text-sm text-white">OR</span>
        <div className="h-px flex-1 bg-white/30"></div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google login failed.")}
        />
      </div>

      <p className="mt-6 text-sm text-white">
        Don’t have an account?
        <Link to="/register" className="ml-2 font-medium underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;