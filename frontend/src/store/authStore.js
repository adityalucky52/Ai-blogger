import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

const useAuthStore = create(
  persist(
    (set) => ({
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
        } catch (error) {
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
        } catch (error) {
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
        const state = JSON.parse(localStorage.getItem("auth-storage"))?.state;
        if (state?.token) {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${state.token}`;
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

export default useAuthStore;
