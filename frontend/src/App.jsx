import { createContext, useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import HomePage from "./pages/public/HomePage";
import BlogPage from "./pages/public/BlogPage";
import CategoryPage from "./pages/public/CategoryPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import MyBlogs from "./pages/dashboard/MyBlogs";
import CreateBlog from "./pages/dashboard/CreateBlog";
import EditBlog from "./pages/dashboard/EditBlog";
import AIGenerate from "./pages/dashboard/AIGenerate";
import MediaLibrary from "./pages/dashboard/MediaLibrary";
import Settings from "./pages/dashboard/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageBlogs from "./pages/admin/ManageBlogs";
import ManageCategories from "./pages/admin/ManageCategories";

// Auth Context
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

function App() {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider defaultTheme="light">
      <AuthContext.Provider value={{ user, login, logout }}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard Routes (Protected) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="blogs" element={<MyBlogs />} />
            <Route path="blogs/new" element={<CreateBlog />} />
            <Route path="blogs/edit/:id" element={<EditBlog />} />
            <Route path="ai-generate" element={<AIGenerate />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin Routes (Admin Only) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="categories" element={<ManageCategories />} />
          </Route>
        </Routes>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
