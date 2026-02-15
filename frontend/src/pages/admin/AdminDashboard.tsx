import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  FileText,
  Eye,
  TrendingUp,
  ArrowUpRight,
  UserPlus,
  AlertTriangle,
  Activity,
} from "lucide-react";

import { useEffect, useState } from "react";
import api from "../../api/axios";

interface Stat {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

interface RecentUser {
  id: string; // Changed to string for _id
  name: string;
  email: string;
  blogs: number;
  joinedAt: string;
}

interface RecentBlog {
  id: string; // Changed to string for _id
  title: string;
  author: string;
  status: string;
  views: number;
}

interface Alert {
  type: string;
  message: string;
}

// Strip HTML tags from text
const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/admin/stats");
        const data = response.data;

        // Transform stats
        const newStats: Stat[] = [
          {
            title: "Total Users",
            value: data.stats.totalUsers.toLocaleString(),
            change: `+${data.stats.newUsers} this week`,
            icon: Users,
            color: "from-blue-500 to-cyan-500",
          },
          {
            title: "Total Blogs",
            value: data.stats.totalBlogs.toLocaleString(),
            change: `+${data.stats.newBlogs} this week`,
            icon: FileText,
            color: "from-violet-500 to-indigo-500",
          },
          {
            title: "Total Views",
            value: data.stats.totalViews.toLocaleString(),
            change: "+18% this month", // Placeholder
            icon: Eye,
            color: "from-green-500 to-emerald-500",
          },
          {
            title: "Active Users",
            value: data.stats.newUsers.toString(), // Proxy
            change: "+5% from yesterday", // Placeholder
            icon: Activity,
            color: "from-orange-500 to-red-500",
          },
        ];

        // Transform Recent Users
        const newRecentUsers: RecentUser[] = data.recentUsers.map((user: any) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          blogs: user.blogs || 0,
          joinedAt: new Date(user.createdAt).toLocaleDateString(),
        }));

        // Transform Recent Blogs
        const newRecentBlogs: RecentBlog[] = data.recentBlogs.map((blog: any) => ({
          id: blog._id,
          title: stripHtml(blog.title),
          author: blog.author ? blog.author.name : "Unknown",
          status: blog.status,
          views: blog.views,
        }));

        setStats(newStats);
        setRecentUsers(newRecentUsers);
        setRecentBlogs(newRecentBlogs);
        setAlerts(data.alerts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
     return <div className="p-8 text-center">Loading dashboard stats...</div>;
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your platform's performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/admin/blogs">
              <FileText className="h-4 w-4 mr-2" />
              Blogs
            </Link>
          </Button>
        </div>
      </div>

      {/* Alerts - simplified */}
      {alerts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`px-4 py-3 rounded-md text-sm font-medium flex items-center gap-3 border ${
                alert.type === "warning"
                  ? "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50"
                  : "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50"
              }`}
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards - cleaner look */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-xs hover:shadow-sm transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
              <CardDescription>Latest registered members</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
              <Link to="/admin/users">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback className="text-xs bg-muted">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none group-hover:underline cursor-pointer">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{user.blogs} blogs</p>
                    <p className="text-xs text-muted-foreground">{user.joinedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Blogs */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">Recent Blogs</CardTitle>
              <CardDescription>Latest published content</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
              <Link to="/admin/blogs">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentBlogs.map((blog) => (
                <div key={blog.id} className="flex items-center justify-between group">
                  <div className="space-y-1 min-w-0 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none truncate group-hover:underline cursor-pointer">
                        {blog.title}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={`text-[10px] px-1 py-0 h-4 font-normal ${
                          blog.status === 'published' 
                            ? 'bg-foreground text-background hover:bg-foreground/90' 
                            : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                        }`}
                      >
                        {blog.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      by {blog.author}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium tabular-nums">
                      {blog.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
