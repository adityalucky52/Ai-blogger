import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { topic, search, category } = req.query;
    let where: any = {
      status: 'published' // Default to only published posts
    };

    if (topic && topic !== "All") {
      where.topic = topic as string;
    }

    if (category) {
      where.category = {
        contains: category as string,
        mode: 'insensitive'
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { excerpt: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const blogs = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const blog = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, avatar: true }
        }
      }
    });

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/id/:id
// @access  Private
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const blog = await prisma.post.findUnique({
      where: { id }
    });

    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role === 'admin') {
        return res.status(401).json({ message: "Only standard users can create blog posts" });
    }

    const { title, excerpt, content, image, category, topic, tags } = req.body;

    // Generate Slug from Title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const blog = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        category,
        topic: topic || null,
        tags: tags || [],
        authorId: req.user.id as string,
        status: 'published' // Or set to 'pending' if you want review
      }
    });

    res.status(201).json(blog);
  } catch (error: any) {
    if (error.code === 'P2002') {
       return res.status(400).json({ message: "A blog with this title/slug already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const id = req.params.id as string;
    const blog = await prisma.post.findUnique({ where: { id } });

    if (blog) {
      // Check ownership
      if (
        blog.authorId !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res
          .status(401)
          .json({ message: "Not authorized to update this blog" });
      }

      const updatedBlog = await prisma.post.update({
        where: { id },
        data: {
          title: req.body.title || undefined,
          excerpt: req.body.excerpt || undefined,
          content: req.body.content || undefined,
          image: req.body.image || undefined,
          category: req.body.category || undefined,
          topic: req.body.topic || undefined,
          tags: req.body.tags || undefined,
        }
      });

      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const id = req.params.id as string;
    const blog = await prisma.post.findUnique({ where: { id } });

    if (blog) {
      // Check ownership
      if (
        blog.authorId !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res
          .status(401)
          .json({ message: "Not authorized to delete this blog" });
      }

      await prisma.post.delete({ where: { id } });
      res.json({ message: "Blog removed" });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's blogs
// @route   GET /api/blogs/myblogs
// @access  Private
export const getMyBlogs = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role === 'admin') {
        return res.status(401).json({ message: "Not authorized" });
    }

    const blogs = await prisma.post.findMany({
      where: { authorId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
