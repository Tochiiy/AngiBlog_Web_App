// IntroPost: shows a featured post (first post returned by the API) at the top of the home page.
// Clicking the section navigates to the post detail page.
import { useState, useEffect } from "react";
import { IoTimeOutline } from "react-icons/io5";
import { IoLogoYoutube } from "react-icons/io";
import { getAllPosts } from "../services/api.js";
import {useNavigate} from "react-router-dom"
const IntroPost = () => {
  const [featured, setFeatured] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFeatured = async () => {
      const data = await getAllPosts();
      setFeatured(data[0]); 
    };
    fetchFeatured();
  }, []);

  if (!featured) return null;

  return (
  <section className="px-6 py-10 border-b border-gray-200 cursor-pointer" onClick={()=>navigate('blog-detail/' + featured.id)}>
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <img
        src={featured.cover_image}
        alt={featured.title}
        className="w-full md:w-[500px] h-[280px] object-cover rounded-lg"
      />
      <div className="flex flex-col gap-4">
        <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full w-fit">
          Featured
        </span>
        <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-500 cursor-pointer">
          {featured.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">{featured.excerpt}</p>

        {/* Author info */}
        <div className="flex items-center gap-2" >
          <img
            src={featured.avatar || "https://i.pravatar.cc/150?img=1"}
            alt={featured.author_name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-gray-700 text-sm font-medium">{featured.author_name}</span>
        </div>

        <div className="flex items-center gap-4 text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <IoTimeOutline className="text-base" />
            <span>{new Date(featured.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric"
            })}</span>
          </div>
          <span>·</span>
          <span>5 min read</span>
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 w-fit hover:bg-blue-600">
          <IoLogoYoutube className="text-lg" />
          Watch on YouTube
        </button>
      </div>
    </div>
  </section>
);
};

export default IntroPost;