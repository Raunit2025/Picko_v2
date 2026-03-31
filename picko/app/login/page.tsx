"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Utensils, Mail, Lock, Loader2, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useStore((state) => state.setAuth);

  // Form Mode State
  const [isLogin, setIsLogin] = useState(true);

  // Form Field States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handles both standard login and 1-click test logins
  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    setIsLoading(true);
    setError("");

    const targetEmail = loginEmail || email;
    const targetPassword = loginPassword || password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      setAuth(data.user);
      toast.success("Welcome back!");

      if (data.user.role === "owner/admin") router.push("/owner");
      else router.push("/menu");
      
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handles New User Registration
  const handleRegister = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      setAuth(data.user);
      toast.success("Account created successfully!");
      router.push("/menu");
      
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all fields");
      return;
    }
    
    if (isLogin) handleLogin();
    else handleRegister();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 selection:bg-orange-200">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
        <div className="p-8 sm:p-10">
          
          {/* Header */}
          <div className="flex flex-col items-center justify-center space-y-3 mb-8">
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/30">
              <Utensils className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-neutral-900">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-neutral-500 text-sm font-medium text-center">
              {isLogin ? "Campus food delivery, sorted. Sign in to continue." : "Join thousands of students and skip the queue."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 text-center animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            
            {/* Name Field (Only visible during Sign Up) */}
            {!isLogin && (
              <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  // ADDED: text-neutral-900 and placeholder:text-neutral-400
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                placeholder="University Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // ADDED: text-neutral-900 and placeholder:text-neutral-400
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium"
                disabled={isLoading}
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // ADDED: text-neutral-900 and placeholder:text-neutral-400
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>{isLogin ? "Sign In" : "Sign Up"} <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          {/* Toggle Login/Register Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-neutral-500 text-sm font-medium hover:text-orange-600 transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="font-bold text-neutral-900">{isLogin ? "Sign up" : "Sign in"}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-neutral-200"></div>
            <span className="px-4 text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
              Developer Testing
            </span>
            <div className="flex-1 border-t border-neutral-200"></div>
          </div>

          {/* 1-Click Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleLogin("student@university.edu", "password123")}
              disabled={isLoading}
              className="w-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
            >
              1-Click: Test Customer
            </button>
            <button
              type="button"
              onClick={() => handleLogin("owner@dominos.com", "password123")}
              disabled={isLoading}
              className="w-full bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
            >
              1-Click: Test Owner
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}