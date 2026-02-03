import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock blogs data
const mockBlogs = [
  {
    id: 1,
    title: "The Future of AI in Content Creation",
    author: "John Doe",
    authorEmail: "john@example.com",
    status: "published",
    category: "Technology",
    views: 2340,
    createdAt: "2026-02-01",
  },
  {
    id: 2,
    title: "Building Scalable Web Applications",
    author: "Sarah Smith",
    authorEmail: "sarah@example.com",
    status: "published",
    category: "Development",
    views: 1820,
    createdAt: "2026-01-28",
  },
  {
    id: 3,
    title: "Pending Review Blog Post",
    author: "Mike Johnson",
    authorEmail: "mike@example.com",
    status: "pending",
    category: "Marketing",
    views: 0,
    createdAt: "2026-02-02",
  },
  {
    id: 4,
    title: "Introduction to Machine Learning",
    author: "Emily Brown",
    authorEmail: "emily@example.com",
    status: "published",
    category: "Technology",
    views: 3200,
    createdAt: "2026-01-15",
  },
  {
    id: 5,
    title: "Draft Blog About Travel",
    author: "Alex Turner",
    authorEmail: "alex@example.com",
    status: "draft",
    category: "Travel",
    views: 0,
    createdAt: "2026-01-25",
  },
];

export default function ManageBlogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBlogs = mockBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockBlogs.length,
    published: mockBlogs.filter((b) => b.status === "published").length,
    pending: mockBlogs.filter((b) => b.status === "pending").length,
    draft: mockBlogs.filter((b) => b.status === "draft").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-500";
      case "pending":
        return "bg-amber-500";
      case "draft":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Blogs</h1>
          <p className="text-muted-foreground">
            View and manage all blog posts across the platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Blogs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.published}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.draft}
                </p>
              </div>
            </div>
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
                placeholder="Search blogs by title or author..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                  Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Blogs Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Blog</th>
                  <th className="text-left p-4 font-medium">Author</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Views</th>
                  <th className="text-left p-4 font-medium">Created</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium line-clamp-1 max-w-xs">
                        {blog.title}
                      </p>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{blog.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {blog.authorEmail}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{blog.category}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(blog.status)}>
                        {blog.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {blog.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {blog.createdAt}
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {blog.status === "published" && (
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Live
                            </DropdownMenuItem>
                          )}
                          {blog.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
