import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          status: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
          _count: {
              select: { posts: true }
          }
      }
    });
    
    // Map to include blogs count clearly
    const usersWithStats = users.map(user => ({
        ...user,
        blogs: user._count.posts
    }));

    res.json(usersWithStats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status (role changes are NOT allowed — admin is fixed via tables)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    const user = await prisma.user.findUnique({ where: { id } });

    if (user) {
      if (req.body.status) {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: { status: req.body.status },
          include: {
              _count: {
                  select: { posts: true }
              }
          }
        });

        return res.json({
            ...updatedUser,
            blogs: updatedUser._count.posts
        });
      }
      
      res.status(400).json({ message: "No update data provided" });
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
    const id = req.params.id as string;
    
    // Prisma cascade deletes blogs if configured in schema, otherwise we do it manually
    // Our schema has onDelete: Cascade for Post.author
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User removed" });
  } catch (error: any) {
    if (error.code === 'P2025') {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all blogs for admin
// @route   GET /api/admin/blogs
// @access  Private/Admin
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.post.findMany({
      include: {
        author: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
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
    const id = req.params.id as string;
    if (req.body.status) {
      const updatedBlog = await prisma.post.update({
        where: { id },
        data: { status: req.body.status }
      });
      return res.json(updatedBlog);
    }
    res.status(400).json({ message: "Status is required" });
  } catch (error: any) {
    if (error.code === 'P2025') {
        return res.status(404).json({ message: "Blog not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete blog (as admin)
// @route   DELETE /api/admin/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      await prisma.post.delete({ where: { id } });
      res.json({ message: "Blog removed by admin" });
    } catch (error: any) {
      if (error.code === 'P2025') {
          return res.status(404).json({ message: "Blog not found" });
      }
      res.status(500).json({ message: error.message });
    }
  };

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalBlogs = await prisma.post.count();
    
    // Calculate total views
    const viewsResult = await prisma.post.aggregate({
      _sum: { views: true }
    });
    const totalViews = viewsResult._sum.views || 0;

    // Changes this week
    const now = new Date();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newUsers = await prisma.user.count({
      where: { createdAt: { gte: startOfWeek } }
    });
    const newBlogs = await prisma.post.count({
      where: { createdAt: { gte: startOfWeek } }
    });

    // Recent Users
    const recentUsersRaw = await prisma.user.findMany({
      select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
              select: { posts: true }
          }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    const recentUsers = recentUsersRaw.map(user => ({
        ...user,
        role: 'user', // Assuming all users here are 'user' role for display, or fetch actual role if available
        blogs: user._count.posts
    }));

    // Recent Blogs
    const recentBlogs = await prisma.post.findMany({
      select: {
          id: true,
          title: true,
          status: true,
          views: true,
          createdAt: true,
          author: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    // Pending blogs (assuming 'pending' status for review)
    const pendingBlogsCount = await prisma.post.count({ where: { status: "pending" } }); 

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
