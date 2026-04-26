// CommentsSection: shows comments for a post and allows logged-in users to add/delete.
// Includes a small `UserAvatar` helper that renders initials when no avatar is provided.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getComments, addComment, deleteComment } from "../services/api.js";
import { isUserLoggedIn, getUser } from "../hooks/useAuth.js";
import { IoTrashOutline, IoSendOutline } from "react-icons/io5";

// Initials avatar component
const UserAvatar = ({ username, avatar, size = "w-9 h-9" }) => {
  const initials = username ? username.slice(0, 2).toUpperCase() : "?";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={username}
        className={`${size} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${size} rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0`}>
      <span className="text-white text-xs font-bold">{initials}</span>
    </div>
  );
};

const CommentsSection = ({ postId }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const currentUser = getUser();

  const fetchComments = async () => {
    setLoading(true);
    const data = await getComments(postId);
    setComments(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, [postId]);

  const handleSubmit = async () => {
    if (!isUserLoggedIn()) {
      navigate("/user-login");
      return;
    }
    if (!content.trim()) return;

    setSubmitting(true);
    await addComment(postId, content);
    setContent("");
    fetchComments();
    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    await deleteComment(commentId);
    fetchComments();
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add comment */}
      <div className="flex gap-3 mb-8">
        <UserAvatar
          username={currentUser?.username}
          avatar={currentUser?.avatar}
        />
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isUserLoggedIn() ? "Write a comment..." : "Sign in to leave a comment..."}
            disabled={!isUserLoggedIn()}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-400"
          />
          <div className="flex items-center justify-between">
            {!isUserLoggedIn() ? (
              <button
                onClick={() => navigate("/user-login")}
                className="text-blue-500 text-sm hover:underline"
              >
                Sign in to comment
              </button>
            ) : (
              <span className="text-gray-400 text-xs">
                Signed in as{" "}
                <span className="font-medium text-gray-600">
                  {currentUser?.username}
                </span>
              </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting || !content.trim() || !isUserLoggedIn()}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <IoSendOutline />
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <UserAvatar
                username={comment.username}
                avatar={comment.avatar}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 text-sm">
                      {comment.username}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(comment.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric"
                      })}
                    </span>
                  </div>
                  {currentUser?.id === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <IoTrashOutline className="text-sm" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;