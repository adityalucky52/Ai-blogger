export type UserRole = "user" | "admin";
export type UserStatus = "active" | "inactive" | "suspended";
export type PostStatus = "draft" | "published" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  bio?: string;
  blogs?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id?: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  topic?: string;
  author: Author;
  views: number;
  status: PostStatus;
  featured: boolean;
  tags: string[];
  likes?: string[];
  readTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  blogs?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
