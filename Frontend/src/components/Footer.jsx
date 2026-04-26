// Footer component: contains site info and a simple email subscribe form.
// Uses `subscribeEmail` to POST subscriber addresses to the backend.
import { useState } from "react";
import { subscribeEmail } from "../services/api";
import { IoLogoYoutube, IoLogoTwitter, IoLogoInstagram, IoLogoGithub } from "react-icons/io";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter an email");
      return;
    }

    try {
      const res = await subscribeEmail(email);
      setMessage(res.message || "Subscribed!");
      setEmail("");
    } catch {
      setMessage("Something went wrong");
    }
  };

  return (
    <footer className='border-t border-gray-200 px-6 py-10 mt-auto'>
      <div className='flex flex-col md:flex-row justify-between gap-8'>

        {/* LEFT SIDE (unchanged) */}
        <div className='flex flex-col gap-3'>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-10 h-10 rounded-xl shadow-md">
              <rect width="100" height="100" rx="12" fill="#0f172a"/>
              <text x="50" y="68" fontSize="54" fill="white" textAnchor="middle">A</text>
              <rect x="22" y="76" width="56" height="3" fill="#3b82f6"/>
            </svg>
            <span className="text-lg font-bold text-gray-800">
              Angi<span className="text-blue-500">Blog</span>
            </span>
          </div>

          <p className='text-gray-500 text-sm max-w-xs'>
            A blog about technology, design, and the modern web. New articles every week.
          </p>

          <div className='flex gap-4 text-gray-400 text-xl'>
            <IoLogoYoutube className='hover:text-red-500 cursor-pointer' />
            <IoLogoTwitter className='hover:text-blue-400 cursor-pointer' />
            <IoLogoInstagram className='hover:text-pink-500 cursor-pointer' />
            <IoLogoGithub className='hover:text-gray-700 cursor-pointer' />
          </div>
        </div>

        {/* SUBSCRIBE */}
        <div className='flex flex-col gap-2'>
          <h4 className='font-bold text-gray-800 mb-1'>Subscribe</h4>
          <p className='text-gray-500 text-sm'>Get the latest posts in your inbox.</p>

          <div className='flex items-center border border-gray-300 rounded-md overflow-hidden'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='your@email.com'
              className='flex-1 px-3 py-2 text-sm outline-none text-gray-700'
            />
            <button
              onClick={handleSubscribe}
              className='bg-blue-500 text-white px-3 py-2 text-sm hover:bg-blue-600'
            >
              Go
            </button>
          </div>

          {/* FEEDBACK MESSAGE */}
          {message && (
            <p className="text-xs text-gray-500 mt-1">{message}</p>
          )}
        </div>

      </div>

      <p className='text-center text-gray-400 text-xs mt-10'>
        © 2025 AngiBlog. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;