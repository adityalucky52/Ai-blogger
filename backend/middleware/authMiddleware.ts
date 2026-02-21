import jwt from "jsonwebtoken";
import { prisma } from "../database/prisma.js";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token as string;
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as { id: string };
      
      // Look up Admin first
      let authUser: any = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
      });
      
      if (authUser) {
        authUser.role = "admin";
      } else {
        // Look up standard user
        authUser = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, name: true, email: true, avatar: true, status: true, bio: true, createdAt: true, updatedAt: true }
        });
        if (authUser) authUser.role = "user";
      }

      req.user = authUser;

      if (!req.user) {
         return res.status(401).json({ message: "User no longer exists" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ 
      message: "Not authorized as admin. Access restricted to administrators only." 
    });
  }
};
