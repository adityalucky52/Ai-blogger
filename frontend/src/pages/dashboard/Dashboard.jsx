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
  FileText,
  Eye,
  Heart,
  TrendingUp,
  PenSquare,
  Sparkles,
  ArrowUpRight,
  Clock,
  BarChart3,
} from "lucide-react";

// Mock data
const stats = [
  {
    title: "Total Blogs",
    value: "24",
    change: "+3 this month",
    icon: FileText,
    color: "from-violet-500 to-indigo-500",
  },
  {
    title: "Total Views",
    value: "12.5K",
    change: "+12% from last month",
    icon: Eye,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Total Likes",
    value: "1,842",
    change: "+8% from last month",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Engagement",
    value: "23%",
    change: "+2.5% improvement",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
  },
];

const recentBlogs = [
  {
    id: 1,
    title: "The Future of AI in Content Creation",
    status: "published",
    views: 2340,
    likes: 156,
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Building Scalable Web Applications",
    status: "published",
    views: 1820,
    likes: 98,
    date: "5 days ago",
  },
  {
    id: 3,
    title: "10 Tips for Better Writing",
    status: "draft",
    views: 0,
    likes: 0,
    date: "1 week ago",
  },
  {
    id: 4,
    title: "Introduction to Machine Learning",
    status: "published",
    views: 3200,
    likes: 245,
    date: "2 weeks ago",
  },
];

const quickActions = [
  {
    title: "Write New Blog",
    description: "Create a new blog post from scratch",
    href: "/dashboard/blogs/new",
    icon: PenSquare,
    color: "bg-violet-500",
  },
  {
    title: "AI Generate",
    description: "Use AI to generate blog content",
    href: "/dashboard/ai-generate",
    icon: Sparkles,
    color: "bg-amber-500",
  },
  {
    title: "View Analytics",
    description: "Check your blog performance",
    href: "/dashboard/blogs",
    icon: BarChart3,
    color: "bg-blue-500",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your blog.
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-violet-600 to-indigo-600"
        >
          <Link to="/dashboard/blogs/new">
            <PenSquare className="h-4 w-4 mr-2" />
            New Blog
          </Link>
        </Button>
      </div>

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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Blogs */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Blogs</CardTitle>
              <CardDescription>Your latest blog posts</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/blogs">
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
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{blog.title}</h4>
                      <Badge
                        variant={
                          blog.status === "published" ? "default" : "secondary"
                        }
                        className={
                          blog.status === "published" ? "bg-green-500" : ""
                        }
                      >
                        {blog.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {blog.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {blog.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {blog.date}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/blogs/edit/${blog.id}`}>Edit</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors group"
                >
                  <div
                    className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium group-hover:text-violet-600 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-600 transition-colors" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* AI Tips */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-violet-600/10 via-indigo-600/10 to-purple-600/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold mb-1">
                Boost Your Content with AI
              </h3>
              <p className="text-muted-foreground">
                Try our AI-powered tools to generate blog ideas, improve your
                writing, and create SEO-optimized content in seconds.
              </p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-violet-600 to-indigo-600 shrink-0"
            >
              <Link to="/dashboard/ai-generate">
                Try AI Generator
                <Sparkles className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
