import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to base64 for Cloudinary upload
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "blog-app",
      resource_type: "auto",
    });

    res.status(200).json({
      url: result.secure_url,
      fileId: result.public_id,
      name: result.original_filename,
    });
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    res
      .status(500)
      .json({ message: "Image upload failed", error: error.message });
  }
});

export default router;
