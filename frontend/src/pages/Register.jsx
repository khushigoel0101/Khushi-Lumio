import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthField from "../components/Auth/AuthField";
import reg from "../assets/register.svg";
import { register as registerApi, googleLogin as googleLoginApi } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      await registerApi({ fullName, email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");

      if (!credentialResponse?.credential) {
        setError("Google signup failed.");
        return;
      }

      await googleLoginApi(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Google signup failed.");
    }
  };

  return (
    <AuthLayout
      title="Join Now"
      subtitle="Create your account and start generating smart meeting summaries."
      image={reg}
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <AuthField
          placeholder="Enter Full Name"
          value={fullName}
          onChange={setFullName}
        />
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
          {loading ? "Creating account..." : "Join"}
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
          onError={() => setError("Google signup failed.")}
        />
      </div>

      <p className="mt-6 text-sm text-white">
        Already have an account?
        <Link to="/login" className="ml-2 font-medium underline">
          Log In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;