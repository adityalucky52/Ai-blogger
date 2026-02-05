import express from "express";
import multer from "multer";
import imagekit from "../utils/imageKit.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await imagekit.upload({
      file: req.file.buffer, // required
      fileName: req.file.originalname, // required
      folder: "/blog-app", // optional
    });

    res.status(200).json({
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    });
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    res
      .status(500)
      .json({ message: "Image upload failed", error: error.message });
  }
});

export default router;
