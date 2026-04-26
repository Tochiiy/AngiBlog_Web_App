// API helper: functions that call backend endpoints.
// Keep this file focused on network calls only.
const BASE_URL = "http://localhost:5000/api";

const getAuthHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${
    localStorage.getItem("userToken") || localStorage.getItem("token")
  }`,
});

export const getAllPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
};

export const getPostsByTag = async (tag) => {
  const res = await fetch(`${BASE_URL}/posts?tag=${tag}`);
  return res.json();
};

export const searchPosts = async (query) => {
  const res = await fetch(`${BASE_URL}/posts/search?q=${query}`);
  return res.json();
};

export const getPost = async (slug) => {
  const res = await fetch(`${BASE_URL}/posts/${slug}`);
  return res.json();
};

export const getPostById = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/id/${id}`);
  return res.json();
};

export const createPost = async (postData) => {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(postData),
  });
  return res.json();
};

export const updatePost = async (id, postData) => {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(postData),
  });
  return res.json();
};

export const deletePost = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  return res.json();
};

export const subscribeEmail = async (email) => {
  const res = await fetch(`${BASE_URL}/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

// ---- AUTH ----
export const registerAdmin = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginAdmin = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: getAuthHeader(),
  });
  return res.json();
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const resetPassword = async (token, password) => {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  return res.json();
};



// ---- USERS ----
export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

// ---- COMMENTS ----
export const getComments = async (postId) => {
  const res = await fetch(`${BASE_URL}/comments/${postId}`);
  return res.json();
};

export const addComment = async (postId, content) => {
  const res = await fetch(`${BASE_URL}/comments/${postId}`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ content }),
  });
  return res.json();
};

export const deleteComment = async (commentId) => {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  return res.json();
};

// ---- LIKES ----
export const getLikes = async (postId) => {
  const res = await fetch(`${BASE_URL}/likes/${postId}`);
  return res.json();
};

export const getUserReaction = async (postId) => {
  const res = await fetch(`${BASE_URL}/likes/${postId}/me`, {
    headers: getAuthHeader(),
  });
  return res.json();
};

export const reactToPost = async (postId, type) => {
  const res = await fetch(`${BASE_URL}/likes/${postId}`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ type }),
  });
  return res.json();

};

// ---- USER FORGOT/RESET PASSWORD ----
export const userForgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const userResetPassword = async (token, password) => {
  const res = await fetch(`${BASE_URL}/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  return res.json();
};