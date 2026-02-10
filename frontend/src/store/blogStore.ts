import { create } from "zustand";
import api from "../api/axios";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  slug: string;
  image: string;
  category: string;
  topic?: string;
  excerpt: string;
  readTime: string;
  likes: string[]; // Array of user IDs
  status: "draft" | "published";
  views: number;
  featured: boolean;
  author: {
    _id: string;
    name: string;
    avatar: string;
    bio?: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  blogs: Blog[];
  myBlogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
  error: string | null;
  fetchBlogs: (params?: any) => Promise<void>;
  fetchMyBlogs: () => Promise<void>;
  fetchBlogBySlug: (slug: string) => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  createBlog: (blogData: any) => Promise<Blog>;
  updateBlog: (id: string, blogData: any) => Promise<Blog>;
  deleteBlog: (id: string) => Promise<void>;
  generateAIContent: (prompt: string, type: string) => Promise<string | null>;
}

const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  myBlogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,

  fetchBlogs: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get("/blogs", { params });
      set({ blogs: response.data, isLoading: false });
    } catch (error: any) {
      console.error(error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  fetchMyBlogs: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/blogs/myblogs");
      set({ myBlogs: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  fetchBlogBySlug: async (slug) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/blogs/${slug}`);
      set({ currentBlog: response.data, isLoading: false });
    } catch (error: any) {
      console.error(error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  fetchBlogById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/blogs/id/${id}`);
      set({ currentBlog: response.data, isLoading: false });
    } catch (error: any) {
      console.error(error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  createBlog: async (blogData) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/blogs", blogData);
      set((state) => ({
        blogs: [response.data, ...state.blogs],
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  updateBlog: async (id, blogData) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/blogs/${id}`, blogData);
      set((state) => ({
        blogs: state.blogs.map((b) => (b._id === id ? response.data : b)),
        currentBlog: response.data,
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBlog: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/blogs/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((b) => b._id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  generateAIContent: async (prompt, type) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/ai/generate", { prompt, type });
      set({ isLoading: false });
      return response.data.content;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "AI Generation failed",
        isLoading: false,
      });
      return null;
    }
  },
}));

export default useBlogStore;
