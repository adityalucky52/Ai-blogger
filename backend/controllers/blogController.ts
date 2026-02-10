import Blog from "../models/Blog.js";
import { Request, Response } from "express";
import { IUser } from "../models/User.js";

interface AuthRequest extends Request {
  user?: IUser | null;
}

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { topic, search, category } = req.query;
    let query: any = {};

    if (topic && topic !== "All") {
      query.topic = topic;
    }

    // Support legacy category logic or new logic
    if (category) {
      query.category = { $regex: (category as string), $options: "i" };
    }

    if (search) {
      query.$or = [
        { title: { $regex: (search as string), $options: "i" } },
        { excerpt: { $regex: (search as string), $options: "i" } },
        { content: { $regex: (search as string), $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

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
    const blog = await Blog.findOne({ slug: req.params.slug }).populate(
      "author",
      "name avatar",
    );
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
    const blog = await Blog.findById(req.params.id);
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
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const { title, excerpt, content, image, category, topic, tags } = req.body;

    // Generate Slug from Title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const blog = new Blog({
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      topic,
      tags,
      author: req.user._id,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error: any) {
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
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      // Check ownership
      if (
        blog.author.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(401)
          .json({ message: "Not authorized to update this blog" });
      }

      blog.title = req.body.title || blog.title;
      blog.excerpt = req.body.excerpt || blog.excerpt;
      blog.content = req.body.content || blog.content;
      blog.image = req.body.image || blog.image;
      blog.category = req.body.category || blog.category;
      blog.topic = req.body.topic || blog.topic;

      const updatedBlog = await blog.save();
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
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      // Check ownership
      if (
        blog.author.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(401)
          .json({ message: "Not authorized to delete this blog" });
      }

      await blog.deleteOne();
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
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const blogs = await Blog.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
