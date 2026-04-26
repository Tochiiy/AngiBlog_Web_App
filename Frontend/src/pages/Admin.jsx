// Admin panel: create, edit, and delete posts. Requires admin auth token in localStorage.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPosts, createPost, updatePost, deletePost } from "../services/api.js";
import { IoAddOutline, IoTrashOutline, IoPencilOutline, IoCloseOutline, IoCheckmarkOutline } from "react-icons/io5";
import { logout } from "../hooks/useAuth.js";



const emptyForm = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  cover_image: "",
  author_id: "",
  tags: "",
};

const Admin = () => {
 const navigate = useNavigate();


  const handleLogout = () => {
  logout();
  navigate("/login");
};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // fetch all posts
  const fetchPosts = async () => {
    setLoading(true);
    const data = await getAllPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // auto generate slug from title
    if (name === "title") {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  };

  // open form for creating
  const handleCreate = () => {
    setEditingPost(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  // open form for editing
  const handleEdit = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      cover_image: post.cover_image,
      author_id: post.author_id,
      tags: post.tags?.join(", ") || "",
    });
    setShowForm(true);
  };

  // submit create or update
  const handleSubmit = async () => {
    if (!form.title || !form.content || !form.author_id) {
      setMessage({ type: "error", text: "Title, content and author ID are required!" });
      return;
    }

    setSubmitting(true);

    const payload = {
      ...form,
      author_id: parseInt(form.author_id),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (editingPost) {
      await updatePost(editingPost.id, payload);
      setMessage({ type: "success", text: "Post updated successfully!" });
    } else {
      await createPost(payload);
      setMessage({ type: "success", text: "Post created successfully!" });
    }

    setSubmitting(false);
    setShowForm(false);
    setForm(emptyForm);
    fetchPosts();

    setTimeout(() => setMessage(null), 3000);
  };

  // delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await deletePost(id);
    setMessage({ type: "success", text: "Post deleted successfully!" });
    fetchPosts();
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <button
  onClick={handleLogout}
  className="bg-red-50 text-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-100 transition-colors"
    >
  Logout
  </button>
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Manage your blog posts</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <IoAddOutline className="text-lg" />
          New Post
        </button>
      </div>

      <div className="px-6 py-6">

        {/* Success/Error message */}
        {message && (
          <div className={`mb-4 px-4 py-3 rounded-md text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoCloseOutline className="text-2xl" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Post title"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="auto-generated-from-title"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Cover Image URL</label>
                <input
                  name="cover_image"
                  value={form.cover_image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Author ID *</label>
                <input
                  name="author_id"
                  value={form.author_id}
                  onChange={handleChange}
                  placeholder="1, 2 or 3"
                  type="number"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="React, JavaScript, Web Development"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Excerpt</label>
                <input
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="Short description..."
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Content *</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write your full post content here..."
                  rows={6}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-blue-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <IoCheckmarkOutline className="text-lg" />
                {submitting ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-600 px-5 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Posts Table */}
        {loading ? (
          <p className="text-gray-400">Loading posts...</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Cover</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Author</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Tags</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr
                    key={post.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index === posts.length - 1 ? "border-0" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{post.title}</p>
                      <p className="text-gray-400 text-xs">{post.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.avatar || "https://i.pravatar.cc/150?img=1"}
                          alt={post.author_name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-gray-600">{post.author_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric"
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-1.5 bg-blue-50 text-blue-500 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <IoPencilOutline className="text-base" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
                        >
                          <IoTrashOutline className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {posts.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                No posts yet. Create your first post!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;