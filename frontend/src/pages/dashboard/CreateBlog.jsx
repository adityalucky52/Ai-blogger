import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Save,
  Eye,
  Send,
  Upload,
  Wand2,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import useBlogStore from "../../store/blogStore";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { createBlog, generateAIContent, isLoading } = useBlogStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: null,
  });

  // Quill Editor Refs
  const titleEditorRef = useRef(null);
  const titleQuillRef = useRef(null);
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize Title Quill Editor
  useEffect(() => {
    if (titleEditorRef.current && !titleQuillRef.current) {
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

      // Sync Title Quill content with state
      titleQuillRef.current.on("text-change", () => {
        const html = titleQuillRef.current.root.innerHTML;
        setBlog((prev) => ({ ...prev, title: html }));
      });
    }
  }, []);

  // Initialize Content Quill Editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
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

      // Sync Quill content with state
      quillRef.current.on("text-change", () => {
        const html = quillRef.current.root.innerHTML;
        setBlog((prev) => ({ ...prev, content: html }));
      });
    }
  }, []);

  // Update Quill when content changes externally (e.g., AI generation)
  useEffect(() => {
    if (quillRef.current) {
      const currentContent = quillRef.current.root.innerHTML;
      // Only update if content is different (to avoid infinite loops)
      if (
        blog.content !== currentContent &&
        blog.content !== currentContent.replace(/<p><br><\/p>/g, "")
      ) {
        quillRef.current.root.innerHTML = blog.content;
      }
    }
  }, [blog.content]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
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
      setBlog((prev) => ({ ...prev, image: response.data.url }));
    } catch (error) {
      console.error("Upload failed", error);
      const msg =
        error.response?.data?.message ||
        "Image upload failed. Please check your connection.";
      alert(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await createBlog({
        ...blog,
        category: "Technology",
        image:
          blog.image ||
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      });
      navigate("/dashboard/blogs");
    } catch (error) {
      console.error("Failed to publish:", error);
    }
    setIsPublishing(false);
  };

  const handleSaveDraft = async () => {
    if (!blog.title || blog.title === "<p><br></p>") {
      alert("Please enter a title before saving");
      return;
    }
    setIsSavingDraft(true);
    try {
      await createBlog({
        ...blog,
        status: "draft",
        category: "Technology",
        excerpt:
          blog.excerpt ||
          blog.content.substring(0, 160).replace(/<[^>]*>/g, "") ||
          "Draft blog post",
        image:
          blog.image ||
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      });
      alert("Draft saved successfully!");
      navigate("/dashboard/blogs");
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert("Failed to save draft. Please try again.");
    }
    setIsSavingDraft(false);
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleAIGenerate = async (type) => {
    let prompt = "";
    if (type === "generate") {
      prompt = blog.title;
      if (!prompt)
        return alert("Please enter a blog title first to generate content");
    }

    const content = await generateAIContent(prompt, type);
    if (content) {
      if (type === "generate") {
        // Update both state and Quill editor
        setBlog((prev) => ({ ...prev, content: content }));
        if (quillRef.current) {
          quillRef.current.root.innerHTML = content;
        }
      }
    } else {
      alert(
        "AI Generation Failed. Please check the console or ensure your API Key is valid in backend/.env",
      );
    }
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
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isPublishing}
          >
            {isSavingDraft ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </Button>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                  onClick={() => handleAIGenerate("generate")}
                  disabled={isLoading || !blog.title}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isLoading ? "Generating..." : "Generate from Title"}
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
              {blog.image ? (
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img
                    src={blog.image}
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
                      setBlog({ ...blog, image: null });
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
                    {isUploading ? "Uploading..." : "Click or drag to upload"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
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
            <div
              className="w-full h-48 bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity overflow-hidden relative"
              onClick={() => fileInputRef.current?.click()}
            >
              {blog.image ? (
                <img
                  src={blog.image}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {isUploading
                      ? "Uploading..."
                      : "Click to upload Featured Image"}
                  </span>
                </div>
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
                setBlog((prev) => ({ ...prev, title: e.target.innerHTML }));
                if (titleQuillRef.current) {
                  titleQuillRef.current.root.innerHTML = e.target.innerHTML;
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
