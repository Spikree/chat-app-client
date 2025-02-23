import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.ts";
import { Eye, EyeOff, Mail, MessageSquare,Lock, Loader2 } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern.js";
import { Link } from "react-router-dom";

type formData = {
  email: string,
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<formData>({
    email: "",
    password: "",
  });

  const {login,isLoggingIn} = useAuthStore();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData)
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
    {/* left side of the page */}
    <div className="flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        {/* logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Login</h1>
            <p className="text-base-content/60">
              Get started with your new account
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleLogin(e)} className="space-y-6">

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                placeholder="enter your email"
                className="input input-bordered w-full pl-10"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-base-content/60">
            don't have an account?{" "}
            <Link to={"/signUp"} className="link text-primary">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>

    <AuthImagePattern
      title="join our community"
      subtitle="connet with people, share your memories and stay in touch with your loved ones"
    />
  </div>
  )
};

export default LoginPage;
