// LikesSection: shows like/dislike counts and lets logged-in users react to a post.
// Internally fetches counts and the current user's reaction when mounted.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLikes, getUserReaction, reactToPost } from "../services/api.js";
import { isUserLoggedIn } from "../hooks/useAuth.js";
import { IoThumbsUpOutline, IoThumbsDownOutline, IoThumbsUp, IoThumbsDown } from "react-icons/io5";

const LikesSection = ({ postId }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [reaction, setReaction] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getLikes(postId);
      setLikes(parseInt(data.likes));
      setDislikes(parseInt(data.dislikes));

      if (isUserLoggedIn()) {
        const me = await getUserReaction(postId);
        setReaction(me.reaction);
      }
    };
    fetch();
  }, [postId]);

  const handleReact = async (type) => {
    if (!isUserLoggedIn()) {
      navigate("/user-login");
      return;
    }

    await reactToPost(postId, type);

    // update counts locally
    const data = await getLikes(postId);
    setLikes(parseInt(data.likes));
    setDislikes(parseInt(data.dislikes));

    const me = await getUserReaction(postId);
    setReaction(me.reaction);
  };

  return (
    <div className="flex items-center gap-4 py-4 border-t border-b border-gray-200 my-6">
      <span className="text-gray-600 text-sm font-medium">Was this helpful?</span>

      <button
        onClick={() => handleReact("like")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          reaction === "like"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500"
        }`}
      >
        {reaction === "like" ? <IoThumbsUp /> : <IoThumbsUpOutline />}
        {likes}
      </button>

      <button
        onClick={() => handleReact("dislike")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          reaction === "dislike"
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
        }`}
      >
        {reaction === "dislike" ? <IoThumbsDown /> : <IoThumbsDownOutline />}
        {dislikes}
      </button>

      {!isUserLoggedIn() && (
        <span className="text-gray-400 text-xs">
          <button onClick={() => navigate("/user-login")} className="text-blue-500 hover:underline">
            Sign in
          </button> to react
        </span>
      )}
    </div>
  );
};

export default LikesSection;