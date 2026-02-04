import { create } from "zustand";
import api from "../api/axios";

const useBlogStore = create((set) => ({
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      set({
        error: error.response?.data?.message || "AI Generation failed",
        isLoading: false,
      });
      return null;
    }
  },
}));

export default useBlogStore;
