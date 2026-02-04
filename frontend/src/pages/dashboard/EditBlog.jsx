import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Save,
  Eye,
  ArrowLeft,
  ChevronDown,
  X,
  Trash2,
  Upload,
  Wand2,
  Loader2,
} from "lucide-react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import useBlogStore from "../../store/blogStore";

const topics = [
  "AI & Machine Learning",
  "Web Development",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
];

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentBlog,
    fetchBlogById,
    updateBlog,
    deleteBlog,
    generateAIContent,
    isLoading,
  } = useBlogStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [blog, setBlog] = useState(null);
  const [tagInput, setTagInput] = useState("");

  // Quill Editor Refs
  const titleEditorRef = useRef(null);
  const titleQuillRef = useRef(null);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    fetchBlogById(id);
  }, [id, fetchBlogById]);

  useEffect(() => {
    if (currentBlog) {
      setBlog({
        title: currentBlog.title || "",
        content: currentBlog.content || "",
        excerpt: currentBlog.excerpt || "",
        topic: currentBlog.topic || "",
        tags: currentBlog.tags || [],
        status: currentBlog.status || "published",
        featuredImage: currentBlog.image || null,
      });
    }
  }, [currentBlog]);

  // Initialize Title Quill Editor
  useEffect(() => {
    if (titleEditorRef.current && !titleQuillRef.current && blog) {
      titleQuillRef.current = new Quill(titleEditorRef.current, {
        theme: "snow",
        placeholder: "Enter your blog title...",
        modules: {
          toolbar: [
            [{ size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline"],
            [{ color: [] }],
            ["clean"],
          ],
        },
      });

      // Set initial content
      if (blog.title) {
        titleQuillRef.current.root.innerHTML = blog.title;
      }

      // Sync Title Quill content with state
      titleQuillRef.current.on("text-change", () => {
        const html = titleQuillRef.current.root.innerHTML;
        setBlog((prev) => ({ ...prev, title: html }));
      });
    }
  }, [blog]);

  // Initialize Content Quill Editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current && blog) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Start writing your amazing blog post...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link", "image"],
            [{ align: [] }],
            ["clean"],
          ],
        },
      });

      // Set initial content
      if (blog.content) {
        quillRef.current.root.innerHTML = blog.content;
      }

      // Sync Quill content with state
      quillRef.current.on("text-change", () => {
        const html = quillRef.current.root.innerHTML;
        setBlog((prev) => ({ ...prev, content: html }));
      });
    }
  }, [blog]);

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
    try {
      await updateBlog(id, {
        ...blog,
        category: "Technology",
        image: blog.featuredImage,
      });
      navigate("/dashboard/blogs");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update blog. Please try again.");
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this blog? This action cannot be undone.",
      )
    ) {
      try {
        await deleteBlog(id);
        navigate("/dashboard/blogs");
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete blog. Please try again.");
      }
    }
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleAIGenerate = async () => {
    const titleText = blog.title.replace(/<[^>]*>/g, "").trim();
    if (!titleText) {
      alert("Please enter a blog title first to generate content");
      return;
    }
    const content = await generateAIContent(titleText, "generate");
    if (content) {
      setBlog((prev) => ({ ...prev, content: content }));
      if (quillRef.current) {
        quillRef.current.root.innerHTML = content;
      }
    } else {
      alert("AI Generation Failed. Please try again.");
    }
  };

  if (!blog)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        <span className="ml-2">Loading blog data...</span>
      </div>
    );

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
            className={
              blog.status === "published" ? "bg-green-500" : "bg-orange-500"
            }
          >
            {blog.status}
          </Badge>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            className="bg-linear-to-r from-violet-600 to-indigo-600"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
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
          {/* Title with Quill */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div ref={titleEditorRef} className="title-editor" />
            </CardContent>
          </Card>

          {/* Quill Editor */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 pb-16 relative">
              <div
                ref={editorRef}
                className="min-h-[300px]"
                style={{ fontSize: "16px", lineHeight: "1.6" }}
              />
              <div className="absolute bottom-4 right-4 z-20">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100 hover:text-violet-700"
                  onClick={handleAIGenerate}
                  disabled={isLoading}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isLoading ? "Generating..." : "Regenerate Content"}
                </Button>
              </div>
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
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
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

          {/* Topic */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {blog.topic || "Select topic"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {topics.map((t) => (
                    <DropdownMenuItem
                      key={t}
                      onClick={() => setBlog({ ...blog, topic: t })}
                    >
                      {t}
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

          {/* Danger Zone */}
          <Card className="border-0 shadow-md border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-600">
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Blog
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog - Editable */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center justify-between">
              Blog Preview
              <span className="text-sm font-normal text-muted-foreground">
                (Click to edit)
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Preview Featured Image */}
            <div className="w-full h-48 bg-linear-to-r from-violet-500 to-indigo-500 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              {blog.featuredImage ? (
                <img
                  src={blog.featuredImage}
                  alt="Featured"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-white/60">
                  Click to upload Featured Image
                </span>
              )}
            </div>

            {/* Preview Topic & Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {blog.topic && (
                <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                  {blog.topic}
                </Badge>
              )}
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Editable Title */}
            <div
              className="text-3xl font-bold outline-none border-2 border-transparent rounded-lg p-2 hover:border-violet-200 focus:border-violet-400 dark:hover:border-violet-800 dark:focus:border-violet-600 transition-colors"
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{
                __html:
                  blog.title ||
                  "<span class='text-muted-foreground'>Click to add title...</span>",
              }}
              onBlur={(e) => {
                setBlog((prev) => ({ ...prev, title: e.target.innerHTML }));
                if (titleQuillRef.current) {
                  titleQuillRef.current.root.innerHTML = e.target.innerHTML;
                }
              }}
            />

            {/* Editable Content */}
            <div
              className="blog-content prose dark:prose-invert max-w-none outline-none border-2 border-transparent rounded-lg p-4 min-h-[200px] hover:border-violet-200 focus:border-violet-400 dark:hover:border-violet-800 dark:focus:border-violet-600 transition-colors"
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{
                __html:
                  blog.content ||
                  "<p class='text-muted-foreground'>Click to add content...</p>",
              }}
              onBlur={(e) => {
                setBlog((prev) => ({ ...prev, content: e.target.innerHTML }));
                if (quillRef.current) {
                  quillRef.current.root.innerHTML = e.target.innerHTML;
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
