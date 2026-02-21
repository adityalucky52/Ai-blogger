import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useFetch } from "../../hooks/useFetch";
import { Category, PostStatus } from "../../types";
import { stripHtmlTags } from "../../utils/textUtils";

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentBlog,
    fetchBlogById,
    updateBlog,
    deleteBlog,
    generateAIContent,
    isLoading: isAILoading,
  } = useBlogStore();

  const { data: categories } = useFetch<Category>("/categories");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "published" as PostStatus,
    image: "",
    category: "Technology",
  });

  const titleEditorRef = useRef<HTMLDivElement>(null);
  const titleQuillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) fetchBlogById(id);
  }, [id, fetchBlogById]);

  useEffect(() => {
    if (currentBlog) {
      setBlog({
        title: currentBlog.title || "",
        content: currentBlog.content || "",
        excerpt: currentBlog.excerpt || "",
        status: currentBlog.status || "published",
        image: currentBlog.image || "",
        category: currentBlog.category || "Technology",
      });

      if (titleQuillRef.current) titleQuillRef.current.root.innerHTML = currentBlog.title || "";
      if (quillRef.current) quillRef.current.root.innerHTML = currentBlog.content || "";
    }
  }, [currentBlog]);

  useEffect(() => {
    if (titleEditorRef.current && !titleQuillRef.current) {
      titleQuillRef.current = new Quill(titleEditorRef.current, {
        theme: "snow",
        placeholder: "Enter title...",
        modules: { toolbar: [[{ size: ["small", false, "large", "huge"] }], ["bold", "italic", "underline"], ["clean"]] },
      });
      titleQuillRef.current.on("text-change", () => {
        setBlog((prev) => ({ ...prev, title: titleQuillRef.current?.root.innerHTML || "" }));
      });
    }
  }, []);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Start writing...",
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
        setBlog((prev) => ({ ...prev, content: quillRef.current?.root.innerHTML || "" }));
      });
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 5 * 1024 * 1024) return alert("File missing or too large (>5MB)");

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    try {
      const { data } = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setBlog((prev) => ({ ...prev, image: data.url }));
    } catch (error: any) {
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
    const strippedTitle = stripHtmlTags(blog.title);
    if (!strippedTitle) return alert("Title is required");

    setIsUpdating(true);
    try {
      await updateBlog(id, blog);
      navigate("/dashboard/blogs");
    } catch (error) {
      alert("Failed to update blog");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (id && confirm("Are you sure?")) {
      try {
        await deleteBlog(id);
        navigate("/dashboard/blogs");
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  const handleAIGenerate = async () => {
    const titleText = stripHtmlTags(blog.title);
    if (!titleText) return alert("Enter a title first");
    const content = await generateAIContent(titleText, "generate");
    if (content) {
      setBlog((prev) => ({ ...prev, content }));
      if (quillRef.current) quillRef.current.root.innerHTML = content;
    }
  };

  if (!currentBlog && !id) return <div className="p-8 text-center text-muted-foreground">Blog not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/blogs")}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Blog</h1>
            <p className="text-muted-foreground text-sm">Update your post</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={blog.status === "published" ? "default" : "secondary"}>{blog.status}</Badge>
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}><Eye className="h-4 w-4 mr-2" />Preview</Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md"><CardContent className="p-4"><div ref={titleEditorRef} className="title-editor" /></CardContent></Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 pb-16 relative">
              <div ref={editorRef} className="min-h-[350px] text-base" />
              <div className="absolute bottom-4 right-4">
                <Button size="sm" variant="outline" onClick={handleAIGenerate} disabled={isAILoading}>
                  <Wand2 className="h-4 w-4 mr-2" /> {isAILoading ? "Generating..." : "Regenerate AI"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Status & Category</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)} <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => setBlog({ ...blog, status: "draft" })}>Draft</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setBlog({ ...blog, status: "published" })}>Published</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Category</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {blog.category} <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 overflow-y-auto max-h-60">
                    {categories.map((cat) => (
                      <DropdownMenuItem key={cat.id} onClick={() => setBlog({ ...blog, category: cat.name })}>{cat.name}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Featured Image</CardTitle></CardHeader>
            <CardContent>
              {blog.image ? (
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={blog.image} alt="Featured" className="w-full h-40 object-cover rounded-lg" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={(e) => { e.stopPropagation(); setBlog({ ...blog, image: "" }); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{isUploading ? "Uploading..." : "Click to upload"}</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3"><CardTitle className="text-lg text-destructive">Danger Zone</CardTitle></CardHeader>
            <CardContent><Button variant="destructive" className="w-full" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" />Delete Blog</Button></CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit View Preview</DialogTitle></DialogHeader>
          <div className="space-y-6">
            <div className="w-full h-64 bg-muted rounded-xl overflow-hidden">
              {blog.image && <img src={blog.image} alt="Featured" className="w-full h-full object-cover" />}
            </div>
            <div className="text-4xl font-bold leading-tight" dangerouslySetInnerHTML={{ __html: blog.title || "No Title" }} />
            <div className="blog-content prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.content || "<p>No content...</p>" }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
