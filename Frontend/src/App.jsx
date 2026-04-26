// App component: defines routes and protected admin area.
// ProtectedRoute is a simple wrapper that checks `isLoggedIn()`.
import Home from './pages/Home';
import About from "./pages/About";
import Blog from "./pages/Blog";
import Admin from './pages/Admin';
import { isLoggedIn } from "./hooks/useAuth.js";
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BlogDetail from './pages/BlogDetail';
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";
import Login from "./pages/Login";
import UserLogin from "./pages/UserLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminRegister from "./pages/AdminRegister";
import UserForgotPassword from "./pages/UserForgotPassword";
import UserResetPassword from "./pages/UserResetPassword";

const ProtectedRoute = ({ children }) => {
  // Redirect to /login when not authenticated
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-forgot-password" element={<UserForgotPassword />} />
        <Route path="/user-reset-password" element={<UserResetPassword />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<ProtectedRoute>
            <Admin />
          </ProtectedRoute>} />
        <Route path="/blog" element={<Blog />} />
        <Route path="blog-detail/:id" element={<BlogDetail />}> </Route>
         <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} /> 

      </Routes>
      <Footer />

    </>
  )
}

export default App
