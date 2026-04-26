// User login/register page for site visitors who want to comment or react.
// Stores `userToken` and `user` in localStorage on success.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/api.js";

const UserLogin = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const data = isRegister
      ? await registerUser({ username: form.username, email: form.email, password: form.password })
      : await loginUser({ email: form.email, password: form.password });

    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    localStorage.setItem("userToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10 rounded-xl">
            <rect width="100" height="100" rx="12" fill="#0f172a"/>
            <text x="50" y="68" fontFamily="Georgia, serif" fontSize="54" fontWeight="700" fill="white" textAnchor="middle">A</text>
            <rect x="22" y="76" width="56" height="3" rx="1.5" fill="#3b82f6"/>
          </svg>
          <span className="text-xl font-bold text-gray-800">
            Angi<span className="text-blue-500">Blog</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {isRegister ? "Create an account" : "Welcome back"}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {isRegister ? "Sign up to comment and react to posts" : "Sign in to join the conversation"}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-md mb-4">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          {isRegister && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input name="username" value={form.username} onChange={handleChange}
                placeholder="johndoe"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="john@example.com"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="••••••••"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500" />
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="bg-blue-500 text-white py-2.5 rounded-md font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 mt-2">
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </div>
          {!isRegister && (
        <div className="text-right mt-2">
          <button
            type="button" 
            onClick={(e) => {
              e.preventDefault(); // Prevents accidental form submission
              navigate("/user-forgot-password");
            }}
            className="text-blue-500 text-sm hover:underline"
          >
            Forgot password?
          </button>
        </div>
      )}
        <p className="text-center text-gray-500 text-sm mt-6">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => { setIsRegister(!isRegister); setError(null); }}
            className="text-blue-500 font-medium ml-1 hover:text-blue-600">
            {isRegister ? "Sign in" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;