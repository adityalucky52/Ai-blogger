import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.js";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: IUser | null;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Strict check: User must be admin AND their email must match the env variable
  if (
    req.user && 
    req.user.role === "admin" && 
    req.user.email === process.env.ADMIN_EMAIL
  ) {
    next();
  } else {
    res.status(401).json({ 
      message: "Not authorized as admin. Access restricted to system administrator." 
    });
  }
};
