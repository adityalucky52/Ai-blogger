import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Upload,
} from "lucide-react";

const categories = [
  "Technology",
  "Lifestyle",
  "Travel",
  "Business",
  "Marketing",
  "Writing",
];

export default function CreateBlog() {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [],
    featuredImage: null,
  });
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

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsPublishing(false);
    navigate("/dashboard/blogs");
  };

  const handleSaveDraft = () => {
    // Save as draft logic
    console.log("Saving draft...", blog);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Blog</h1>
          <p className="text-muted-foreground">
            Write and publish your blog post
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            className="bg-gradient-to-r from-violet-600 to-indigo-600"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Publishing...
              </span>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Publish
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
                className="text-2xl font-bold border-0 shadow-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50"
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
                placeholder="Start writing your amazing blog post..."
                className="min-h-[500px] border-0 shadow-none focus-visible:ring-0 resize-none text-lg leading-relaxed"
                value={blog.content}
                onChange={(e) => setBlog({ ...blog, content: e.target.value })}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Helper */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-violet-600/10 via-indigo-600/10 to-purple-600/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-violet-600" />
                AI Writing Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                Generate blog outline
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                Improve writing style
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                Generate SEO description
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                Suggest headlines
              </Button>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click or drag to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
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
              <p className="text-xs text-muted-foreground mt-2">
                {blog.excerpt.length}/160 characters recommended
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
