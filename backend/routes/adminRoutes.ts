import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getAllBlogs,
  updateBlogStatus,
  deleteBlog,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", protect, admin, getDashboardStats);

// User Routes
router.route("/users")
  .get(protect, admin, getUsers);

router.route("/users/:id")
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// Blog Routes
router.route("/blogs")
  .get(protect, admin, getAllBlogs);

router.route("/blogs/:id")
  .put(protect, admin, updateBlogStatus)
  .delete(protect, admin, deleteBlog);

export default router;
