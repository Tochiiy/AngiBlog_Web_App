// Blog listing page: fetches posts and supports tag filtering and search.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoTimeOutline, IoSearchOutline } from "react-icons/io5";
import { getAllPosts, getPostsByTag, searchPosts } from "../services/api.js";

const tags = ["All", "React", "CSS", "Backend", "JavaScript", "Python", "Web Development", "UI/UX", "AI", "Tools"];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focus, setFocus] = useState(0);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await getAllPosts();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleTagClick = async (index) => {
    setFocus(index);
    setLoading(true);
    const data = tags[index] === "All"
      ? await getAllPosts()
      : await getPostsByTag(tags[index]);
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) return fetchPosts();
    setLoading(true);
    const data = await searchPosts(query);
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">Blog</span>
        <h1 className="text-4xl font-bold text-gray-800 mt-4 mb-2">All Articles</h1>
        <p className="text-gray-500 text-sm">Browse all our posts on web development, AI, tools and more.</p>
      </div>

      {/* Search */}
      <div className="flex items-center w-full max-w-lg mx-auto border border-gray-300 rounded-md overflow-hidden mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 px-4 py-2 outline-none text-gray-700 text-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 flex items-center gap-2 hover:bg-blue-600"
        >
          <IoSearchOutline className="text-lg" />
          Search
        </button>
      </div>

      {/* Tags */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
        {tags.map((tag, index) => (
          <span
            key={tag}
            onClick={() => handleTagClick(index)}
            className={`px-3 py-1 rounded-full cursor-pointer text-sm whitespace-nowrap transition-colors ${
              focus === index
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <p className="text-gray-400 text-center py-10">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/blog-detail/${post.id}`)}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                <div className="flex items-center gap-2">
                  <img
                    src={post.avatar || "https://i.pravatar.cc/150?img=1"}
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
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;