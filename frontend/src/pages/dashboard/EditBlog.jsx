import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Save,
  Eye,
  Send,
  ArrowLeft,
  Image,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  Sparkles,
  ChevronDown,
  X,
  Trash2,
} from "lucide-react";

const categories = [
  "Technology",
  "Lifestyle",
  "Travel",
  "Business",
  "Marketing",
  "Writing",
];

// Mock blog data
const mockBlog = {
  id: 1,
  title: "The Future of AI in Content Creation: A Complete Guide",
  content: `Artificial Intelligence is transforming how we create, edit, and distribute content. In this comprehensive guide, we'll explore the current state of AI in content creation and what the future holds.

Over the past few years, we've witnessed an unprecedented surge in AI-powered writing tools. From simple grammar checkers to sophisticated content generators, these tools are becoming indispensable for content creators worldwide.

The technology behind these tools has evolved significantly. Early versions relied on simple pattern matching and rule-based systems. Today's AI writers use advanced language models that can understand context, maintain consistency, and even adapt to different writing styles.`,
  excerpt:
    "Discover how artificial intelligence is revolutionizing the way we create and consume content.",
  category: "Technology",
  tags: ["AI", "Content Creation", "Writing", "Future Tech"],
  status: "published",
  featuredImage:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
};

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [blog, setBlog] = useState(mockBlog);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!blog.tags.includes(tagInput.trim())) {
        setBlog({ ...blog, tags: [...blog.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setBlog({ ...blog, tags: blog.tags.filter((tag) => tag !== tagToRemove) });
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsUpdating(false);
    navigate("/dashboard/blogs");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/blogs")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Blog</h1>
            <p className="text-muted-foreground">
              Make changes to your blog post
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={blog.status === "published" ? "default" : "secondary"}
            className={blog.status === "published" ? "bg-green-500" : ""}
          >
            {blog.status}
          </Badge>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            className="bg-gradient-to-r from-violet-600 to-indigo-600"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Updating...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Input
                placeholder="Enter your blog title..."
                className="text-2xl font-bold border-0 shadow-none focus-visible:ring-0 px-0"
                value={blog.title}
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Editor Toolbar */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-2">
              <div className="flex flex-wrap items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Underline className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Quote className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Code className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-violet-600"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Assist
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Textarea
                placeholder="Start writing..."
                className="min-h-[500px] border-0 shadow-none focus-visible:ring-0 resize-none text-lg leading-relaxed"
                value={blog.content}
                onChange={(e) => setBlog({ ...blog, content: e.target.value })}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {blog.featuredImage ? (
                <div className="relative">
                  <img
                    src={blog.featuredImage}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => setBlog({ ...blog, featuredImage: null })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer">
                  <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload image
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem
                    onClick={() => setBlog({ ...blog, status: "draft" })}
                  >
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setBlog({ ...blog, status: "published" })}
                  >
                    Published
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* Category */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {blog.category || "Select category"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => setBlog({ ...blog, category: cat })}
                    >
                      {cat}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Add tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Excerpt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write a short description..."
                className="min-h-[100px]"
                value={blog.excerpt}
                onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-0 shadow-md border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-600">
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Blog
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
