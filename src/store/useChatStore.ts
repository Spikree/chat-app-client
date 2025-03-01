import { create } from "zustand";
import axiosInstance from "../lib/axios.ts";
import toast from "react-hot-toast";
import { AxiosError } from 'axios';

export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true})
        try {
            const response = await axiosInstance.get("/messages/users")
            set({users: response.data.filteredUsers})
            toast.success(response.data.message)
            set({isUsersLoading:false})
        } catch (error) {
            set({isUsersLoading:false})
            toast.error((error as AxiosError<{message: string}>).response?.data?.message || 'An error occurred');
        } finally {
            set({isUsersLoading:false})
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

    sendMessages: async (messageData) => {
        const {selectedUser,messages} = get();
        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            console.log(response)
            set({ messages: [...messages, response.data.newMessage] });
        } catch (error) {
            toast.error((error as AxiosError<{message: string}>).response?.data?.message || 'An error occurred');
        }
    },

    setSelectedUser : (selectedUser) => set({selectedUser})
}))