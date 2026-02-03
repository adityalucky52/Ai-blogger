import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Filter,
  SortAsc,
  FileText,
  Clock,
} from "lucide-react";

// Mock data
const mockBlogs = [
  {
    id: 1,
    title: "The Future of AI in Content Creation: A Complete Guide",
    excerpt:
      "Discover how artificial intelligence is revolutionizing content creation...",
    status: "published",
    category: "Technology",
    views: 2340,
    publishedAt: "2026-02-01",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Building Scalable Web Applications with React",
    excerpt:
      "Learn the best practices for building scalable React applications...",
    status: "published",
    category: "Development",
    views: 1820,
    publishedAt: "2026-01-28",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
  },
  {
    id: 3,
    title: "10 Tips for Better Technical Writing",
    excerpt: "Improve your technical writing skills with these proven tips...",
    status: "draft",
    category: "Writing",
    views: 0,
    publishedAt: null,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop",
  },
  {
    id: 4,
    title: "Introduction to Machine Learning Basics",
    excerpt: "A beginner-friendly guide to understanding machine learning...",
    status: "published",
    category: "Technology",
    views: 3200,
    publishedAt: "2026-01-15",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop",
  },
  {
    id: 5,
    title: "Remote Work Productivity Tips",
    excerpt: "Maximize your productivity while working from home...",
    status: "draft",
    category: "Lifestyle",
    views: 0,
    publishedAt: null,
    image:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=300&h=200&fit=crop",
  },
];

export default function MyBlogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBlogs = mockBlogs.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockBlogs.length,
    published: mockBlogs.filter((b) => b.status === "published").length,
    drafts: mockBlogs.filter((b) => b.status === "draft").length,
    views: mockBlogs.reduce((acc, b) => acc + b.views, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Blogs</h1>
          <p className="text-muted-foreground">
            Manage and organize your blog posts
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-violet-600 to-indigo-600"
        >
          <Link to="/dashboard/blogs/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Blog
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Blogs</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Published</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.published}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Drafts</p>
            <p className="text-2xl font-bold text-orange-600">{stats.drafts}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Views</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.views.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {statusFilter === "all"
                      ? "All Status"
                      : statusFilter.charAt(0).toUpperCase() +
                        statusFilter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("published")}
                  >
                    Published
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                    Drafts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" className="gap-2">
                <SortAsc className="h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog List */}
      <div className="space-y-4">
        {filteredBlogs.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No blogs found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first blog post to get started"}
              </p>
              <Button asChild>
                <Link to="/dashboard/blogs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Blog
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-32 md:h-auto">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              blog.status === "published"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              blog.status === "published"
                                ? "bg-green-500"
                                : "bg-orange-500"
                            }
                          >
                            {blog.status}
                          </Badge>
                          <Badge variant="outline">{blog.category}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {blog.views.toLocaleString()} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {blog.publishedAt || "Not published"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/dashboard/blogs/edit/${blog.id}`}
                              className="flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {blog.status === "published" && (
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/blog/${blog.id}`}
                                className="flex items-center"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Live
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
