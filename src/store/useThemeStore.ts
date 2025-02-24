import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme:localStorage.getItem("theme") || "light",
    setTheme: (theme : string) => {
        localStorage.setItem("theme",theme)
        set({theme:theme})
    }
}));