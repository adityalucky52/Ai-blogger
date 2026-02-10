import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

export interface User {
  _id: string;
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
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post("/auth/login", { email, password });
          const { token, ...userData } = response.data;

          set({
            user: userData,
            token: token,
            isAuthenticated: true,
            isLoading: false,
          });

          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
          const { token, ...userData } = response.data;

          set({
            user: userData,
            token: token,
            isAuthenticated: true,
            isLoading: false,
          });

          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete api.defaults.headers.common["Authorization"];
      },

      initializeAuth: () => {
        const stored = localStorage.getItem("auth-storage");
        const state = stored ? JSON.parse(stored)?.state : null;
        if (state?.token) {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${state.token}`;
        }
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
