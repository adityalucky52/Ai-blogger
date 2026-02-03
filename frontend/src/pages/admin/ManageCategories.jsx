import { useState } from "react";
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
} from "lucide-react";

// Mock categories data
const mockCategories = [
  {
    id: 1,
    name: "Technology",
    slug: "technology",
    blogs: 45,
    color: "#3B82F6",
  },
  { id: 2, name: "Lifestyle", slug: "lifestyle", blogs: 32, color: "#10B981" },
  { id: 3, name: "Travel", slug: "travel", blogs: 24, color: "#F59E0B" },
  { id: 4, name: "Business", slug: "business", blogs: 19, color: "#8B5CF6" },
  { id: 5, name: "Marketing", slug: "marketing", blogs: 28, color: "#EC4899" },
  {
    id: 6,
    name: "Development",
    slug: "development",
    blogs: 38,
    color: "#06B6D4",
  },
  { id: 7, name: "Writing", slug: "writing", blogs: 15, color: "#EF4444" },
];

export default function ManageCategories() {
  const [categories, setCategories] = useState(mockCategories);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#3B82F6",
  });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;

    const category = {
      id: Date.now(),
      name: newCategory.name,
      slug: newCategory.name.toLowerCase().replace(/\s+/g, "-"),
      blogs: 0,
      color: newCategory.color,
    };

    setCategories([...categories, category]);
    setNewCategory({ name: "", color: "#3B82F6" });
    setShowAddDialog(false);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const totalBlogs = categories.reduce((acc, cat) => acc + cat.blogs, 0);

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
          className="bg-gradient-to-r from-rose-600 to-orange-600"
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
              <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <FolderTree className="h-5 w-5 text-violet-600" />
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
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
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
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Avg per Category
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(totalBlogs / categories.length)}
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
            {categories.map((category) => (
              <div
                key={category.id}
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

                <Badge variant="secondary">{category.blogs} blogs</Badge>

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
                      className="text-red-600"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
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
              <div className="flex gap-2">
                {[
                  "#3B82F6",
                  "#10B981",
                  "#F59E0B",
                  "#8B5CF6",
                  "#EC4899",
                  "#EF4444",
                  "#06B6D4",
                ].map((color) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-lg ${newCategory.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
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
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2">
                {[
                  "#3B82F6",
                  "#10B981",
                  "#F59E0B",
                  "#8B5CF6",
                  "#EC4899",
                  "#EF4444",
                  "#06B6D4",
                ].map((color) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-lg ${editCategory?.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditCategory({ ...editCategory, color })}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategory(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setCategories(
                  categories.map((c) =>
                    c.id === editCategory.id ? editCategory : c,
                  ),
                );
                setEditCategory(null);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
