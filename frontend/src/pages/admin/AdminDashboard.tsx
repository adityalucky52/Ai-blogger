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

interface Stat {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

interface RecentUser {
  id: number;
  name: string;
  email: string;
  blogs: number;
  joinedAt: string;
}

interface RecentBlog {
  id: number;
  title: string;
  author: string;
  status: string;
  views: number;
}

interface Alert {
  type: string;
  message: string;
}

// Mock data
const stats: Stat[] = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12 this week",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Total Blogs",
    value: "3,456",
    change: "+45 this week",
    icon: FileText,
    color: "from-violet-500 to-indigo-500",
  },
  {
    title: "Total Views",
    value: "125K",
    change: "+18% this month",
    icon: Eye,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Active Users",
    value: "892",
    change: "+5% from yesterday",
    icon: Activity,
    color: "from-orange-500 to-red-500",
  },
];

const recentUsers: RecentUser[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    blogs: 12,
    joinedAt: "2 hours ago",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    blogs: 8,
    joinedAt: "5 hours ago",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    blogs: 3,
    joinedAt: "Yesterday",
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily@example.com",
    blogs: 0,
    joinedAt: "2 days ago",
  },
];

const recentBlogs: RecentBlog[] = [
  {
    id: 1,
    title: "Getting Started with AI",
    author: "John Doe",
    status: "published",
    views: 1234,
  },
  {
    id: 2,
    title: "Web Development Tips",
    author: "Sarah Smith",
    status: "published",
    views: 856,
  },
  {
    id: 3,
    title: "The Future of Technology",
    author: "Mike Johnson",
    status: "pending",
    views: 0,
  },
  {
    id: 4,
    title: "Productivity Hacks",
    author: "Emily Brown",
    status: "published",
    views: 2341,
  },
];

const alerts: Alert[] = [
  { type: "warning", message: "3 blogs pending review" },
  { type: "info", message: "15 new users this week" },
];

export default function AdminDashboard() {
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
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-500 font-medium">{stat.change}</span>
                </p>
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
                            ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
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
