// Header component: displays site logo, navigation links, and user actions (sign in/out).
// Keeps navigation simple and uses `getUser()` to show logged-in user info.
import { useNavigate } from "react-router-dom";
import { IoLogoYoutube } from "react-icons/io";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { isUserLoggedIn, getUser, logoutUser } from "../hooks/useAuth.js";
import { useState } from "react";
import UserAvatar from "../components/UserAvater";

const Header = () => {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isUserLoggedIn();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About us", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Contact us", href: "mailto:Tochukwusun24@gmail.com" },
  ];

  return (
    <header className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10 rounded-xl shadow-md">
            <rect width="100" height="100" rx="12" fill="#0f172a"/>
            <text x="50" y="68" fontFamily="Georgia, serif" fontSize="54" fontWeight="700" fill="white" textAnchor="middle">A</text>
            <rect x="22" y="76" width="56" height="3" rx="1.5" fill="#3b82f6"/>
          </svg>
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            Angi<span className="text-blue-500">Blog</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.href ? (
              <a key={link.label} href={link.href}
                className="text-gray-700 hover:text-blue-500 text-sm transition-colors whitespace-nowrap">
                {link.label}
              </a>
            ) : (
              <span key={link.label} onClick={() => navigate(link.path)}
                className="text-gray-700 hover:text-blue-500 text-sm transition-colors whitespace-nowrap cursor-pointer">
                {link.label}
              </span>
            )
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {loggedIn ? (
            <div className="hidden md:flex items-center gap-3">
              <UserAvatar user={user} size="w-8 h-8" />
              <span className="text-gray-700 text-sm font-medium">{user?.username}</span>
              <button onClick={handleLogout} className="text-gray-500 text-sm hover:text-red-500 transition-colors">
                Sign out
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/user-login")}
              className="hidden md:block bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors">
              Sign in
            </button>
          )}

          <button className="hidden md:flex bg-blue-500 text-white px-4 py-2 rounded-md items-center gap-2 hover:bg-blue-600 transition-colors text-sm">
            <IoLogoYoutube className="text-lg" />
            Subscribe
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 text-2xl"
          >
            {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 pb-4 border-t border-gray-100 pt-4">
          {navLinks.map((link) =>
            link.href ? (
              <a key={link.label} href={link.href}
                className="text-gray-700 hover:text-blue-500 text-sm transition-colors"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ) : (
              <span key={link.label}
                onClick={() => { navigate(link.path); setMenuOpen(false); }}
                className="text-gray-700 hover:text-blue-500 text-sm transition-colors cursor-pointer">
                {link.label}
              </span>
            )
          )}

          {/* Mobile user section */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {loggedIn ? (
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="w-8 h-8" />
                <span className="text-gray-700 text-sm font-medium">{user?.username}</span>
                <button onClick={handleLogout} className="text-red-500 text-sm">
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { navigate("/user-login"); setMenuOpen(false); }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                Sign in
              </button>
            )}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition-colors text-sm">
              <IoLogoYoutube className="text-lg" />
              Subscribe
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;