import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const topics = [
  "AI & Machine Learning",
  "Web Development",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
];

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
    topic: "",
    tags: [],
    featuredImage: null,
  });
  const [tagInput, setTagInput] = useState("");

  // Quill Editor Refs
  const titleEditorRef = useRef(null);
  const titleQuillRef = useRef(null);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

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
    try {
      await createBlog({
        ...blog,
        category: "Technology",
        topic: blog.topic,
        image:
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
        topic: blog.topic || "General",
        excerpt:
          blog.excerpt ||
          blog.content.substring(0, 160).replace(/<[^>]*>/g, "") ||
          "Draft blog post",
        image:
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
            className="bg-linear-to-r from-violet-600 to-indigo-600"
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
                  className="bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100 hover:text-violet-700"
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
              <span className="text-white/60">
                Click to upload Featured Image
              </span>
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
