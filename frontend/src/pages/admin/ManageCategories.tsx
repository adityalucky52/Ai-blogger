import { useState, useEffect } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  FolderTree,
  FileText,
  GripVertical,
  Loader2,
} from "lucide-react";
import api from "../../api/axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  blogs: number;
  color: string;
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#3B82F6",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    setIsSubmitting(true);

    try {
      const response = await api.post("/categories", newCategory);
      // The API returns the created category without the 'blogs' virtual count property immediately populated from DB count (which is 0)
      // but we can manually set it to 0 for UI consistency
      const addedCategory = { ...response.data, blogs: 0 };
      setCategories([addedCategory, ...categories]);
      setNewCategory({ name: "", color: "#3B82F6" });
      setShowAddDialog(false);
    } catch (error) {
      console.error("Failed to add category:", error);
      alert("Failed to add category. It might already exist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategory || !editCategory.name.trim()) return;
    setIsSubmitting(true);

    try {
      const response = await api.put(`/categories/${editCategory._id}`, {
        name: editCategory.name,
        color: editCategory.color,
      });
      
      setCategories(
        categories.map((c) =>
          c._id === editCategory._id ? { ...c, ...response.data } : c
        )
      );
      setEditCategory(null);
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Failed to update category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category.");
    }
  };

  const totalBlogs = categories.reduce((acc, cat) => acc + (cat.blogs || 0), 0);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <p className="text-muted-foreground">
            Organize your blog content with categories
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Categories
                </p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Blogs</p>
                <p className="text-2xl font-bold">{totalBlogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg per Category
                </p>
                <p className="text-2xl font-bold">
                  {categories.length > 0 ? Math.round(totalBlogs / categories.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No categories found. Create one to get started.
              </div>
            ) : (
                categories.map((category) => (
              <div
                key={category._id}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />

                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-medium text-sm"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name.charAt(0)}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">
                    /{category.slug}
                  </p>
                </div>

                <Badge variant="secondary">{category.blogs || 0} blogs</Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditCategory(category)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )))}
          </div>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                placeholder="e.g., Technology"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  "#000000",
                  "#222222",
                  "#444444",
                  "#666666",
                  "#888888",
                  "#AAAAAA",
                  "#CCCCCC",
                  "#EF4444",
                  "#F97316",
                  "#F59E0B",
                  "#10B981",
                  "#3B82F6",
                  "#6366F1",
                  "#8B5CF6",
                  "#EC4899"
                ].map((color) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-lg ${newCategory.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editCategory} onOpenChange={() => setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                value={editCategory?.name || ""}
                onChange={(e) =>
                  setEditCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  "#000000",
                  "#222222",
                  "#444444",
                  "#666666",
                  "#888888",
                  "#AAAAAA",
                  "#CCCCCC",
                  "#EF4444",
                  "#F97316",
                  "#F59E0B",
                  "#10B981",
                  "#3B82F6",
                  "#6366F1",
                  "#8B5CF6",
                  "#EC4899"
                ].map((color) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-lg ${editCategory?.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditCategory((prev) => (prev ? { ...prev, color } : null))}
                    type="button" // Prevent form submission if inside form
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategory(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
