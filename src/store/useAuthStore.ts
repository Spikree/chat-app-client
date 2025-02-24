import { create } from "zustand";
import axiosInstance from "../lib/axios.ts";
import toast from "react-hot-toast";
import { AxiosError } from 'axios';

type authData = {
  email: string;
  password: string;
  name?: string;
  profilePic?: string;
}

type authUser = {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

type AuthStore = {
  authUser: authUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: authData) => Promise<void>;
  login: (data: authData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<authData>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async ( data: authData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post(`/auth/signup`, data);
      set({ authUser: response.data });
      toast.success(response.data.message);
    } catch (error) {
      set({ isSigningUp: false });
      toast.error((error as AxiosError<{message: string}>).response?.data?.message || 'An error occurred');
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async() => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({authUser: null})
      toast.success(response.data.message)
    } catch (error) {
      toast.error((error as AxiosError<{message: string}>).response?.data?.message || 'An error occurred');
    }
  },
  
  login : async(data:authData) => {
    set({isLoggingIn: true})
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({authUser: response.data})
      toast.success(response.data.message)
    } catch (error) {
      toast.error((error as AxiosError<{message: string}>).response?.data?.message || 'An error occurred');
    }
    finally {
      set({isLoggingIn: false})
    }
  },

  updateProfile : async(data) => {
    set({isUpdatingProfile:true});

    try {
      const response = await axiosInstance.put("/auth/update-profile", data)
      set({authUser: response.data})
      toast.success(response.data.message)
    } catch (error) {
      toast.error((error as AxiosError<{message: string}>).response?.data?.message || 'An error occurred');
    } finally {
      set({isUpdatingProfile:false});
    }
  }
}));
