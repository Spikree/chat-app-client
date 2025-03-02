import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore.ts";
import { useThemeStore } from "./store/useThemeStore.ts";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import ProtectedRoutes from "./utils/ProtectedRoutes.tsx";
import { Toaster } from "react-hot-toast";
import AuthRoutes from "./utils/AuthRoutes.js";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
    console.log(onlineUsers)
  }, []);

  

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route element={<AuthRoutes />}>
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
