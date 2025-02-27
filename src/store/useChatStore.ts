import { create } from "zustand";
import axiosInstance from "../lib/axios.ts";
import toast from "react-hot-toast";
import { AxiosError } from 'axios';

export const useChatStore = create((set) => ({
    messages:[],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true})
        try {
            const response = await axiosInstance.get("/messages/users")
            set({users: response.data})
            toast.success(response.data.message)
        } catch (error) {
            set({isUserLoading:false})
            toast.error((error as AxiosError<{message: string}>).response?.data?.message || 'An error occurred');
        }
    },

    getMessages: async(userId: string) => {
        set({isMessagesLoading: true})
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({
                messages: response.data.messages
            })
        } catch (error) {
            toast.error((error as AxiosError<{message: string}>).response?.data?.message || 'An error occurred');
            set({isMessagesLoading: false})
        } finally {
            set({isMessagesLoading: false})
        }
    },

    setSelectedUser : (selectedUser) => set({selectedUser})
}))