import React, { useState } from "react";
import authService from "../appwite/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authRegister } from "../store/slicer";
import { Button, Input, Logo } from "./index.jsx";
import { useForm } from "react-hook-form";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const createAccount = async (data) => {
    setError("");
    setLoading(true);
    try {
      const response = await authService.createAccount(data);
      if (response.success) {
        setSuccess("Account created successfully! Redirecting...");
        const user = await authService.getUser();
        if (user) {
          dispatch(authRegister({ userData: user }));
        }
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(response.error || "Registration failed");
      }
    } catch (err) {
      console.log("Registration failed:", err);
      setError("Registration failed. Please try again. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-purple-900 to-pink-800 p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter backdrop-blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full p-8 bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 relative z-10 transform transition-all duration-700 hover:shadow-3xl hover:border-white/30">
        <div className="animate-float">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-textGlow">
              Join Our Community
            </h1>
            <div className="mb-6 flex justify-center">
              <div className="inline-block p-3 bg-linear-to-br from-purple-600/20 to-pink-600/20 rounded-2xl backdrop-blur-sm border border-white/10 hover:scale-110 transition-all duration-500 hover:rotate-3">
                <Logo width="180px" className="drop-shadow-lg" />
              </div>
            </div>
            <h2 className="text-lg text-white/90 mb-6 animate-fadeInUp">
              Start your journey with us today
            </h2>

            {error && (
              <div className="mb-4 animate-shake">
                <p className="text-red-300 bg-red-900/30 p-3 rounded-xl border border-red-500/50 backdrop-blur-sm">
                  ⚠️ {error}
                </p>
              </div>
            )}
            {success && (
              <div className="mb-4 animate-bounceIn">
                <p className="text-green-300 bg-green-900/30 p-3 rounded-xl border border-green-500/50 backdrop-blur-sm">
                  {success}
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(createAccount)} className="space-y-6">
            <div className="space-y-4">
              <div className="animate-slideInLeft">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Type Your Name"  
                  className="w-full hover:scale-[1.02] transition-transform duration-300"
                  error={errors.name?.message}
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
              </div>

              <div className="animate-slideInRight animation-delay-100">
                <Input
                  label="Username"
                  type="text"
                  placeholder="Select a Unique One"
                  className="w-full hover:scale-[1.02] transition-transform duration-300"
                  error={errors.username?.message}
                  {...register("username", {
                    required: "Username is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Username can only contain letters, numbers, and underscores",
                    },
                  })}
                />
              </div>

              <div className="animate-slideInLeft animation-delay-200">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="complete address: @mail.com"
                  className="w-full hover:scale-[1.02] transition-transform duration-300"
                  error={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
              </div>

              <div className="animate-slideInRight animation-delay-300">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Make a strong password"
                  className="w-full hover:scale-[1.02] transition-transform duration-300"
                  error={errors.password?.message}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 animate-fadeInUp">
              <Link
                to="/login"
                className="text-sm text-blue-300 hover:text-blue-200 hover:underline transition-all duration-300 hover:scale-105 group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  ← Already have an account? Login
                </span>
              </Link>

              <Button
                type="submit"
                disabled={loading}
                bgColor="bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700"
                className="px-10 py-3 rounded-full font-bold text-white shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulseHover min-w-30"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  "Sign Up Now"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              By signing up, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
