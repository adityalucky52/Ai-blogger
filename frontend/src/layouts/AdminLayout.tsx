import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../App";
import { User } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderTree,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  Home,
  Bell,
  Moon,
  Sun,
  Shield,
} from "lucide-react";
import { useState } from "react";

interface AdminLink {
  title: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

const adminLinks: AdminLink[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Manage Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "All Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
];

function AdminSidebar({ className = "" }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (href: string, exact = false) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={`flex flex-col h-full bg-background border-r ${className}`}>
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
            <Shield className="h-4 w-4 text-background" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">BlogAI</span>
            <Badge
              variant="outline"
              className="text-[10px] w-fit px-1.5 py-0 h-4 border-foreground/20 text-foreground/60"
            >
              ADMIN
            </Badge>
          </div>
        </Link>
      </div>

      <div className="px-4">
        <Separator />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all
                ${
                  active
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {link.title}
              {active && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
            </Link>
          );
        })}

        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-medium text-muted-foreground mb-2">
            Quick Access
          </p>
        </div>
        
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          User Dashboard
        </Link>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Home className="h-4 w-4" />
          View Blog
        </Link>
      </nav>

      {/* User Section */}
      <div className="p-4 mt-auto border-t bg-muted/30">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={getAvatarUrl(user?.avatar)} alt={user?.name} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Administrator
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Require authentication & admin role
  if (!isLoading) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r flex-col fixed h-full">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
        {/* Top Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur-xs flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <AdminSidebar />
            </SheetContent>
          </Sheet>

          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
            <Link to="/" className="hover:text-foreground transition-colors hidden sm:flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 hidden sm:block opacity-50" />
            <span className="text-foreground font-medium flex items-center gap-2 whitespace-nowrap">
              <Shield className="h-4 w-4" />
              Admin Overview
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-muted-foreground hover:text-foreground">
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background p-0" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full ml-2 ring-1 ring-border"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={getAvatarUrl(user?.avatar)} alt={user?.name} />
                    <AvatarFallback className="bg-background text-foreground">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={getAvatarUrl(user?.avatar)} alt={user?.name} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {user?.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] w-fit px-1 py-0 h-4 border-foreground/20 text-foreground/60"
                    >
                      Admin
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    View Blog
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <Sparkles className="mr-2 h-4 w-4" />
                    User Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
