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

// Mock data
const stats = [
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

const recentUsers = [
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

const recentBlogs = [
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

const alerts = [
  { type: "warning", message: "3 blogs pending review" },
  { type: "info", message: "15 new users this week" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your blog platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/users">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Link>
          </Button>
          <Button
            className="bg-gradient-to-r from-rose-600 to-orange-600"
            asChild
          >
            <Link to="/admin/blogs">
              <FileText className="h-4 w-4 mr-2" />
              Manage Blogs
            </Link>
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg flex items-center gap-3 ${
                alert.type === "warning"
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                Recent Users
              </CardTitle>
              <CardDescription>Newly registered users</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/users">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.blogs} blogs</p>
                    <p className="text-xs text-muted-foreground">
                      {user.joinedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Blogs */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-violet-600" />
                Recent Blogs
              </CardTitle>
              <CardDescription>Latest blog posts</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/blogs">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{blog.title}</p>
                      <Badge
                        variant={
                          blog.status === "published" ? "default" : "secondary"
                        }
                        className={
                          blog.status === "published"
                            ? "bg-green-500"
                            : "bg-amber-500"
                        }
                      >
                        {blog.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      by {blog.author}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">
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
