import { Request, Response } from "express";
import Category from "../models/Category.js";
import Blog from "../models/Blog.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    // Aggregation to get blog counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        // Assuming Blog.category stores the category slug or name. 
        // Based on the frontend mock data, slug is used in URLs, but Blog model just says String.
        // Let's assume it stores the slug for consistency.
        const count = await Blog.countDocuments({ category: category.slug }); 
        return { ...category.toObject(), blogs: count };
      })
    );

    res.json(categoriesWithCount);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, slug, color });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.color = color || category.color;
    
    if (name) {
       category.slug = name.toLowerCase().replace(/\s+/g, "-");
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.json({ message: "Category removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};
