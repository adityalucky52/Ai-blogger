import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Aggregation to get blog counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await prisma.post.count({ where: { category: category.slug } }); 
        return { ...category, blogs: count };
      })
    );

    return res.json(categoriesWithCount);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
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

    const categoryExists = await prisma.category.findUnique({ where: { slug } });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await prisma.category.create({ 
      data: { name, slug, color } 
    });
    return res.status(201).json(category);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const id = req.params.id as string;

    const data: any = {};
    if (name) {
      data.name = name;
      data.slug = name.toLowerCase().replace(/\s+/g, "-");
    }
    if (color) {
      data.color = color;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data
    });
    
    return res.json(updatedCategory);
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ message: "Category not found" });
    }
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    await prisma.category.delete({
      where: { id }
    });

    return res.json({ message: "Category removed" });
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ message: "Category not found" });
    }
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};
