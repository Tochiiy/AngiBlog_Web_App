// Blogs component: displays a grid of posts. Supports tag filtering and search results.
import { useState, useEffect } from "react";
import { IoTimeOutline, IoArrowForwardOutline } from "react-icons/io5";
import { getAllPosts, getPostsByTag } from "../services/api.js";
import { useNavigate } from 'react-router-dom'

const Blogs = ({ selectedTag, searchResults }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
  useEffect(() => {
    
    if (searchResults) {
      setPosts(searchResults);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try{
      const data = selectedTag && selectedTag !== "All"
        ? await getPostsByTag(selectedTag)
        : await getAllPosts();
      
        if (!Array.isArray(data)) {
        navigate("/500"); 
        return;
      }
      
      setPosts(data);
      } catch (err) {navigate("/500"); };


      setLoading(false);
    };

    fetchPosts();
  }, [selectedTag, searchResults]);

  if (loading) return <p className="px-6 py-10 text-gray-400">Loading...</p>;
  if (posts.length === 0) return <p className="px-6 py-10 text-gray-400">No posts found.</p>;
  


return (
  <section className="px-6 py-10">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Articles</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={()=>navigate('blog-detail/' + post.id)}
        >
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-[180px] object-cover"
          />
          <div className="p-4 flex flex-col gap-3">
            <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full w-fit">
              {post.tags?.[0]}
            </span>
            <h3 className="font-bold text-gray-800 hover:text-blue-500">{post.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>

            {/* Author info */}
            <div className="flex items-center gap-2">
              <img
                src={post.avatar || "https://i.pravatar.cc/150"}
                alt={post.author_name}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-gray-700 text-sm font-medium">{post.author_name}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <IoTimeOutline />
              <span>{new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}</span>
              <span>·</span>
              <span>{post.read_time || "5 min read"}</span>
            </div>
            <button className="flex items-center gap-1 text-blue-500 text-sm font-semibold hover:gap-2 transition-all">
              Read More <IoArrowForwardOutline />
            </button>
                    </div>
        </div>
      ))}
    </div>
  </section>
);       
}; 

export default Blogs;
          