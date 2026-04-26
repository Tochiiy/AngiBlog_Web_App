// Header component: displays site logo, navigation links, and user actions (sign in/out).
// Keeps navigation simple and uses `getUser()` to show logged-in user info.
import { useNavigate } from "react-router-dom";
import { IoLogoYoutube } from "react-icons/io";
import { isUserLoggedIn, getUser, logoutUser } from "../hooks/useAuth.js";
import UserAvatar from "../components/UserAvater";

const Header = () => {
  const navigate = useNavigate();

  const user = getUser();
  const loggedIn = isUserLoggedIn();

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-12 h-12 rounded-xl shadow-md"
        >
          <rect width="100" height="100" rx="12" fill="#0f172a" />
          <text
            x="50"
            y="68"
            fontFamily="Georgia, serif"
            fontSize="54"
            fontWeight="700"
            fill="white"
            textAnchor="middle"
          >
            A
          </text>
          <rect x="22" y="76" width="56" height="3" rx="1.5" fill="#3b82f6" />
        </svg>
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          Angi<span className="text-blue-500">Blog</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-8 overflow-x-auto scrollbar-hide mx-4">
        <span
          onClick={() => navigate("/")}
          className="text-gray-700 hover:text-blue-500 whitespace-nowrap transition-colors text-sm cursor-pointer"
        >
          Home
        </span>
        <span
          onClick={() => navigate("/about")}
          className="text-gray-700 hover:text-blue-500 whitespace-nowrap transition-colors text-sm cursor-pointer"
        >
          About us
        </span>
        <span
          onClick={() => navigate("/blog")}
          className="text-gray-700 hover:text-blue-500 whitespace-nowrap transition-colors text-sm cursor-pointer"
        >
          Blog
        </span>
        <a
          href="mailto:Tochukwusun24@gmail.com"
          className="text-gray-700 hover:text-blue-500 whitespace-nowrap transition-colors text-sm"
        >
          Contact us
        </a>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {loggedIn ? (
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="w-8 h-8" />
            <span className="text-gray-700 text-sm font-medium hidden md:block">
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-500 text-sm hover:text-red-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/user-login")}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors"
          >
            Sign in
          </button>
        )}
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition-colors whitespace-nowrap text-sm flex-shrink-0">
          <IoLogoYoutube className="text-lg" />
          Subscribe
        </button>
      </div>
    </header>
  );
};

export default Header;
