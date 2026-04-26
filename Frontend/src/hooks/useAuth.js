// Simple auth helpers that read/write tokens and user data to localStorage.
// These are synchronous convenience functions used across the app.
export const getToken = () => localStorage.getItem("token");
export const getAdmin = () => JSON.parse(localStorage.getItem("admin"));
export const isLoggedIn = () => !!localStorage.getItem("token");
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
};

export const getUserToken = () => localStorage.getItem("userToken");
export const getUser = () => JSON.parse(localStorage.getItem("user") || "null");
export const isUserLoggedIn = () => !!localStorage.getItem("userToken");
export const logoutUser = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
};