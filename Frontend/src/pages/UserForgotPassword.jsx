// User forgot-password page: sends reset email for non-admin users.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userForgotPassword } from "../services/api.js";

const UserForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);

    const data = await userForgotPassword(email);

    if (data.error) {
      setError(data.error);
    } else {
      setSent(true);
    }
    setLoading(false);
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

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Check your email</h2>
            <p className="text-gray-500 text-sm mb-6">
              If <span className="font-medium text-gray-700">{email}</span> is
              registered you'll receive a reset link shortly.
            </p>
            <button
              onClick={() => navigate("/user-login")}
              className="text-blue-500 text-sm hover:underline"
            >
              Back to login
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Forgot password?</h1>
            <p className="text-gray-500 text-sm mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="john@example.com"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !email}
                className="bg-blue-500 text-white py-2.5 rounded-md font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/user-login")}
                className="text-blue-500 font-medium hover:text-blue-600"
              >
                Sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default UserForgotPassword;