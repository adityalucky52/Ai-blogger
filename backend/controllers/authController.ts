import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary.js";
import { prisma } from "../database/prisma.js";

export interface AuthRequest extends Request {
  user?: any;
}

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

const sendTokenCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Register a new admin
// @route   POST /api/auth/admin/register
// @access  Public (Hidden)
export const adminRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password, secret } = req.body;

    if (secret !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(401).json({ message: "Invalid registration secret" });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    const adminExists = await prisma.admin.findUnique({ where: { email } });

    if (userExists || adminExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (admin) {
      const token = generateToken(admin.id, "admin");
      sendTokenCookie(res, token);

      res.status(201).json({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    const adminExists = await prisma.admin.findUnique({ where: { email } });

    if (userExists || adminExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (user) {
      const token = generateToken(user.id, "user");
      sendTokenCookie(res, token);

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "user",
        avatar: user.avatar,
        status: user.status,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(`🔑 Login attempt for: ${email}`);

    // 1. Try to find in Admin table first
    const adminUser = await prisma.admin.findUnique({ where: { email } });
    if (adminUser) {
      console.log(`👤 Found admin record for ${email}. Comparing passwords...`);
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (isMatch) {
          console.log(`✅ Admin password matched for ${email}`);
          const token = generateToken(adminUser.id, "admin");
          sendTokenCookie(res, token);
          
          return res.json({
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            role: "admin",
            createdAt: adminUser.createdAt,
            updatedAt: adminUser.updatedAt,
          });
      }
      console.log(`❌ Admin password mismatch for ${email}`);
    }

    // 2. Try to find in User table
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      console.log(`👤 Found user record for ${email}. Comparing passwords...`);
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
          console.log(`✅ User password matched for ${email}`);
          const token = generateToken(user.id, "user");
          sendTokenCookie(res, token);

          return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: "user",
            avatar: user.avatar,
            status: user.status,
            bio: user.bio,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
      }
      console.log(`❌ User password mismatch for ${email}`);
    }

    console.log(`🚫 No match found for ${email}`);
    res.status(401).json({ message: "Invalid email or password" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    // req.user is already populated by protect middleware
    res.json(req.user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile (name, bio)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.role === 'admin') {
       return res.status(403).json({ message: "Admins cannot update profile via this route" });
    }

    const { name, bio } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        bio: bio !== undefined ? bio : undefined,
      }
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: "user",
      avatar: updatedUser.avatar,
      status: updatedUser.status,
      bio: updatedUser.bio,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload/update user avatar via Cloudinary
// @route   PUT /api/auth/avatar
// @access  Private
export const updateAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins do not have an avatar profile" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get current user to check for old avatar
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old avatar from Cloudinary
    if (user.avatar && user.avatar.includes("cloudinary.com")) {
      const publicId = user.avatar.split("/").slice(-2).join("/").split(".")[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        // Ignore delete errors
      }
    }

    // Upload new avatar
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "blog-app/avatars",
      resource_type: "image",
      transformation: [
        { width: 300, height: 300, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: result.secure_url }
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: "user",
      avatar: updatedUser.avatar,
      status: updatedUser.status,
      bio: updatedUser.bio,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error: any) {
    console.error("Avatar Upload Error:", error);
    res.status(500).json({ message: "Avatar upload failed", error: error.message });
  }
};
