import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getBlogs).post(protect, createBlog);

router.get("/myblogs", protect, getMyBlogs);
router.get("/id/:id", getBlogById); // Specific route for ID

router.route("/:slug").get(getBlogBySlug);

router.route("/:id").put(protect, updateBlog).delete(protect, deleteBlog);

export default router;
