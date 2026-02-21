import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Button } from "@/components/ui/button";
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
import { useFetch } from "../../hooks/useFetch";
import { Category, PostStatus } from "../../types";
import { stripHtmlTags } from "../../utils/textUtils";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { createBlog, generateAIContent, isLoading: isAILoading } = useBlogStore();
  const { data: categories } = useFetch<Category>("/categories");

  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    category: "Technology",
  });

  // Quill Editor Refs
  const titleEditorRef = useRef<HTMLDivElement>(null);
  const titleQuillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      titleQuillRef.current.on("text-change", () => {
        const html = titleQuillRef.current?.root.innerHTML || "";
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

      quillRef.current.on("text-change", () => {
        const html = quillRef.current?.root.innerHTML || "";
        setBlog((prev) => ({ ...prev, content: html }));
      });
    }
  }, []);

  // Sync Quill with AI content
  useEffect(() => {
    if (quillRef.current && blog.content !== quillRef.current.root.innerHTML) {
      // Check if it's just a paragraph break difference
      const contentWithoutP = blog.content.replace(/<p><br><\/p>/g, "");
      const quillWithoutP = quillRef.current.root.innerHTML.replace(/<p><br><\/p>/g, "");
      
      if (contentWithoutP !== quillWithoutP) {
        quillRef.current.root.innerHTML = blog.content;
      }
    }
  }, [blog.content]);

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
      setBlog((prev) => ({ ...prev, image: response.data.url }));
    } catch (error: any) {
      console.error("Upload failed", error);
      alert(error.response?.data?.message || "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const validateBlog = () => {
    const strippedTitle = stripHtmlTags(blog.title);
    const strippedContent = stripHtmlTags(blog.content);

    if (!strippedTitle) {
      alert("Please enter a blog title.");
      return false;
    }
    if (!strippedContent) {
      alert("Please write some content for your blog.");
      return false;
    }
    return true;
  };

  const handleSave = async (status: PostStatus) => {
    if (status === "published" && !validateBlog()) return;
    if (status === "draft" && !stripHtmlTags(blog.title)) {
      alert("Please enter at least a title for your draft.");
      return;
    }

    const setLoading = status === "published" ? setIsPublishing : setIsSavingDraft;
    setLoading(true);

    try {
      const plainContent = stripHtmlTags(blog.content);
      const generatedExcerpt = plainContent.substring(0, 150) + (plainContent.length > 150 ? "..." : "");

      await createBlog({
        ...blog,
        status,
        excerpt: blog.excerpt || generatedExcerpt || "New Post",
        image: blog.image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      });
      
      navigate("/dashboard/blogs");
    } catch (error: any) {
      console.error(`Failed to save as ${status}:`, error);
      alert(error.response?.data?.message || `Failed to save blog. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async (type: string) => {
    const titleText = stripHtmlTags(blog.title);
    if (!titleText) return alert("Please enter a blog title first to generate content");

    try {
      const content = await generateAIContent(titleText, type);
      if (content) {
        setBlog((prev) => ({ ...prev, content }));
        if (quillRef.current) quillRef.current.root.innerHTML = content;
      }
    } catch (error) {
      console.error("AI Generation Failed:", error);
      alert("AI Generation Failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Blog</h1>
          <p className="text-muted-foreground text-sm">Write and publish your blog post</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={isSavingDraft || isPublishing}
          >
            {isSavingDraft ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </Button>
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => handleSave("published")}
            disabled={isPublishing}
          >
            {isPublishing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div ref={titleEditorRef} className="title-editor" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 pb-16 relative">
              <div ref={editorRef} className="min-h-[350px] text-base leading-relaxed" />
              <div className="absolute bottom-4 right-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate("generate")}
                  disabled={isAILoading || !stripHtmlTags(blog.title)}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isAILoading ? "Generating..." : "Generate from Title"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Category</CardTitle></CardHeader>
            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {blog.category} <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setBlog({ ...blog, category: cat.name })}>
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Featured Image</CardTitle></CardHeader>
            <CardContent>
              {blog.image ? (
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={blog.image} alt="Featured" className="w-full h-40 object-cover rounded-lg group-hover:opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-lg">
                    <span className="bg-black/60 text-white px-3 py-1 rounded-md text-sm">Change Image</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); setBlog({ ...blog, image: "" }); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{isUploading ? "Uploading..." : "Click to upload image"}</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Blog Preview</DialogTitle></DialogHeader>
          <div className="space-y-6">
            <div className="w-full h-64 bg-muted rounded-xl overflow-hidden">
              {blog.image && <img src={blog.image} alt="Featured" className="w-full h-full object-cover" />}
            </div>
            <div className="text-4xl font-bold leading-tight" dangerouslySetInnerHTML={{ __html: blog.title || "No Title" }} />
            <div className="blog-content prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.content || "<p>No content yet...</p>" }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
