import { Request, Response } from "express";
import User from "../models/User.js";
import Blog from "../models/Blog.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const users = await User.find({ email: { $ne: adminEmail } }).sort({ createdAt: -1 });
    
    // Get blog count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const blogCount = await Blog.countDocuments({ author: user._id });
        return {
          ...user.toObject(),
          blogs: blogCount
        };
      })
    );

    res.json(usersWithStats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status (role changes are NOT allowed — admin is fixed via .env)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Role changes blocked — only .env controls admin
      if (req.body.role) {
          return res.status(403).json({ message: "Role changes are not allowed. Admin is controlled via server configuration." });
      }
      if (req.body.status) {
          user.status = req.body.status;
      }

      const updatedUser = await user.save();
      
      // Get updated stats
      const blogCount = await Blog.countDocuments({ author: updatedUser._id });

      res.json({
          ...updatedUser.toObject(),
          blogs: blogCount
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Delete user's blogs
      await Blog.deleteMany({ author: user._id });
      
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all blogs for admin
// @route   GET /api/admin/blogs
// @access  Private/Admin
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email") // Populate author name and email
      .sort({ createdAt: -1 });
    
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update blog status (e.g., publish, reject)
// @route   PUT /api/admin/blogs/:id
// @access  Private/Admin
export const updateBlogStatus = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      if (req.body.status) {
        blog.status = req.body.status;
      }

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete blog (as admin)
// @route   DELETE /api/admin/blogs/:id
// @access  Private/Admin
// Note: We can reuse the existing deleteBlog controller if it allows admins, 
// but having it here separates admin logic if we want to bypass certain checks or log admin actions differently.
// The existing deleteBlog logic checks for admin role, so technically we could reuse it, 
// but let's add a specific one here for completeness with the admin route structure.
export const deleteBlog = async (req: Request, res: Response) => {
    try {
      const blog = await Blog.findById(req.params.id);
  
      if (blog) {
        await blog.deleteOne();
        res.json({ message: "Blog removed by admin" });
      } else {
        res.status(404).json({ message: "Blog not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminFilter = { email: { $ne: adminEmail } };
    
    const totalUsers = await User.countDocuments(adminFilter);
    const totalBlogs = await Blog.countDocuments();
    
    // Calculate total views
    const viewsResult = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

    // Changes this week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - 7));

    const newUsers = await User.countDocuments({ createdAt: { $gte: startOfWeek }, email: { $ne: adminEmail } });
    const newBlogs = await Blog.countDocuments({ createdAt: { $gte: startOfWeek } });

    // Recent Users (exclude admin)
    const recentUsersRaw = await User.find({ email: { $ne: adminEmail } })
      .select("name email createdAt role")
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Fetch blog counts for these recent users
    const recentUsers = await Promise.all(recentUsersRaw.map(async (user) => {
        const blogCount = await Blog.countDocuments({ author: user._id });
        return {
            ...user.toObject(),
            blogs: blogCount
        };
    }));

    // Recent Blogs
    const recentBlogs = await Blog.find()
      .populate("author", "name")
      .select("title author status views createdAt")
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Pending blogs (assuming draft status implies pending review for this context, or just drafts)
    const pendingBlogsCount = await Blog.countDocuments({ status: "draft" }); // Or 'pending' if that status exists

    res.json({
      stats: {
        totalUsers,
        totalBlogs,
        totalViews,
        newUsers,
        newBlogs,
      },
      recentUsers,
      recentBlogs,
      alerts: [
          pendingBlogsCount > 0 ? { type: "warning", message: `${pendingBlogsCount} blogs pending review` } : null,
          newUsers > 0 ? { type: "info", message: `${newUsers} new users this week` } : null
      ].filter(Boolean)
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
