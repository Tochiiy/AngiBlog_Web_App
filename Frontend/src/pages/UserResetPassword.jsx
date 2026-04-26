// User reset password page: similar to admin reset but for regular users.
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userResetPassword } from "../services/api.js";

const UserResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!form.password || !form.confirm) return;

    if (form.password !== form.confirm) {
      setError("Passwords do not match!");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    setError(null);

    const data = await userResetPassword(token, form.password);

    if (data.error) {
      setError(data.error);
    } else {
      setDone(true);
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid reset link</h2>
          <button
            onClick={() => navigate("/user-forgot-password")}
            className="text-blue-500 text-sm hover:underline"
          >
            Request a new one
          </button>
        </div>
      </div>
    );
  }

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

        {done ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Password reset!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your password has been updated successfully.
            </p>
            <button
              onClick={() => navigate("/user-login")}
              className="bg-blue-500 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Sign in now
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Reset password</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your new password below.</p>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm(prev => ({ ...prev, confirm: e.target.value }))}
                  placeholder="••••••••"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 text-white py-2.5 rounded-md font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserResetPassword;