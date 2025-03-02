import { create } from "zustand";
import axiosInstance from "../lib/axios.ts";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { io, Socket } from "socket.io-client";

type authData = {
  email: string;
  password: string;
  name?: string;
  profilePic?: string;
};

type authUser = {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
};

type AuthStore = {
  authUser: authUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  socket: Socket | null;
  onlineUsers: string[];

  checkAuth: () => Promise<void>;
  signup: (data: authData) => Promise<void>;
  login: (data: authData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<authData>) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
};

const BASE_URL = "http://localhost:5000";

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: authData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({ authUser: response.data });
      toast.success(response.data.message);
      get().connectSocket();
    } catch (error) {
      toast.error(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
          "An error occurred"
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success(response.data.message);
      get().disconnectSocket();
    } catch (error) {
      toast.error(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
          "An error occurred"
      );
    }
  },

  login: async (data: authData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data });
      toast.success(response.data.message);
      get().connectSocket();
    } catch (error) {
      toast.error(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
          "An error occurred"
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: response.data });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        (error as AxiosError<{ message: string }>).response?.data?.message ||
          "An error occurred"
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    // Prevent duplicate connections
    if (!authUser || (socket && socket.connected)) return;

    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    // Clear old listeners to prevent memory leaks
    newSocket.off("getOnlineUsers");

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] }); // Clear online users on disconnect
    }
  },
}));
