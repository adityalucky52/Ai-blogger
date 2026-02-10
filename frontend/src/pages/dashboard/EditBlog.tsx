import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
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

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
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
  const [blog, setBlog] = useState<{
    title: string;
    content: string;
    excerpt: string;
    status: string;
    featuredImage: string | null;
  } | null>(null);

  // Quill Editor Refs
  const titleEditorRef = useRef<HTMLDivElement>(null);
  const titleQuillRef = useRef<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlogById(id);
    }
  }, [id, fetchBlogById]);

  useEffect(() => {
    if (currentBlog) {
      setBlog({
        title: currentBlog.title || "",
        content: currentBlog.content || "",
        excerpt: currentBlog.excerpt || "",
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
        setBlog((prev) => (prev ? { ...prev, title: html } : null));
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
        setBlog((prev) => (prev ? { ...prev, content: html } : null));
      });
    }
  }, [blog]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBlog((prev) => (prev ? { ...prev, featuredImage: response.data.url } : null));
    } catch (error: any) {
      console.error("Upload failed", error);
      const msg = error.response?.data?.message || "Image upload failed";
      alert(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!id || !blog) return;
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
    if (!id) return;
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
    if (!blog) return;
    const titleText = blog.title.replace(/<[^>]*>/g, "").trim();
    if (!titleText) {
      alert("Please enter a blog title first to generate content");
      return;
    }
    const content = await generateAIContent(titleText, "generate");
    if (content) {
      setBlog((prev) => (prev ? { ...prev, content: content } : null));
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              blog.status === "published"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }
          >
            {blog.status}
          </Badge>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                  className="bg-background hover:bg-accent"
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
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img
                    src={blog.featuredImage}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                      Change Image
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBlog({ ...blog, featuredImage: null });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {isUploading ? "Uploading..." : "Click to upload image"}
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
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

          {/* Danger Zone */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Danger Zone</CardTitle>
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
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
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

            {/* Editable Title */}
            <div
              className="text-3xl font-bold outline-none border-2 border-transparent rounded-lg p-2 hover:border-input focus:border-ring transition-colors"
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{
                __html:
                  blog.title ||
                  "<span class='text-muted-foreground'>Click to add title...</span>",
              }}
              onBlur={(e) => {
                const html = (e.target as HTMLDivElement).innerHTML;
                setBlog((prev) => (prev ? { ...prev, title: html } : null));
                if (titleQuillRef.current) {
                  titleQuillRef.current.root.innerHTML = html;
                }
              }}
            />

            {/* Editable Content */}
            <div
              className="blog-content prose dark:prose-invert max-w-none outline-none border-2 border-transparent rounded-lg p-4 min-h-[200px] hover:border-input focus:border-ring transition-colors"
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{
                __html:
                  blog.content ||
                  "<p class='text-muted-foreground'>Click to add content...</p>",
              }}
              onBlur={(e) => {
                const html = (e.target as HTMLDivElement).innerHTML;
                setBlog((prev) => (prev ? { ...prev, content: html } : null));
                if (quillRef.current) {
                  quillRef.current.root.innerHTML = html;
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
