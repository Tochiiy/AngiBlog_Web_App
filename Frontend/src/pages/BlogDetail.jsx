// Blog detail page: fetches a single post by id and renders markdown, likes, and comments.
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../services/api.js";
import { IoArrowBackOutline, IoTimeOutline } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import LikesSection from "../components/LikesSection.jsx";
import CommentsSection from "../components/CommentsSection.jsx";


const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await getPostById(id);
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="px-6 py-10 text-gray-400">Loading...</p>;
  if (!post) return <p className="px-6 py-10 text-gray-400">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6 text-sm font-medium"
      >
        <IoArrowBackOutline />
        Back to Home
      </button>

      {/* Cover image */}
      <img
        src={post.cover_image}
        alt={post.title}
        className="w-full h-[300px] object-cover rounded-xl mb-6"
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.map((tag) => (
          <span key={tag} className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>

      {/* Author + date */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        <img
          src={post.avatar || "https://i.pravatar.cc/150?img=1"}
          alt={post.author_name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-gray-800 text-sm font-medium">{post.author_name}</p>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <IoTimeOutline />
            <span>{new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric"
            })}</span>
            <span>· 5 min read</span>
          </div>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="prose prose-gray prose-headings:font-bold prose-a:text-blue-500 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    
      <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
        <ReactMarkdown>{post.content}</ReactMarkdown>
        <LikesSection postId={post.id} />
        <CommentsSection postId={post.id} />
     </div>


    </div>
  );
};

export default BlogDetail;