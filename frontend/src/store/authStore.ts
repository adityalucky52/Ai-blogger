import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  error: string | null;
  isLoading: boolean;
  clearError: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  adminRegister: (name: string, email: string, password: string, secret: string) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => void;
  updateProfile: (data: { name?: string; bio?: string }) => Promise<boolean>;
  updateAvatar: (file: File) => Promise<boolean>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      error: null,
      clearError: () => set({ error: null }),
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          const userData = response.data;

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          return false;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/register", {
            name,
            email,
            password,
          });
          const userData = response.data;

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          return false;
        }
      },

      adminRegister: async (name, email, password, secret) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/admin/register", {
            name,
            email,
            password,
            secret
          });
          const userData = response.data;

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Admin registration failed",
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // The cookie will be cleared by the browser if the backend handles it or it expires
        // Or we can add an api call to logout to clear the cookie
        api.post("/auth/logout").catch(() => {}); // Optional: backend logout to clear cookie
      },

      initializeAuth: () => {
        // withCredentials handles the cookie automatically
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put("/auth/profile", data);
          set({
            user: { ...get().user!, ...response.data },
            isLoading: false,
          });
          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Profile update failed",
            isLoading: false,
          });
          return false;
        }
      },

      updateAvatar: async (file) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append("avatar", file);

          const response = await api.put("/auth/avatar", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          set({
            user: { ...get().user!, ...response.data },
            isLoading: false,
          });
          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Avatar upload failed",
            isLoading: false,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
