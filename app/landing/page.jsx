"use client";

import React from "react";
import DemoLoginButton from "@/components/demo-login";

export default function LandingPage() {
  const handleSignIn = () => {
    window.location.href = "/sign-in";
  };

  const handleSignUp = () => {
    window.location.href = "/sign-up";
  };

  const buttonStyles =
    "w-full max-w-xs px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  const primaryButtonStyles = `${buttonStyles} bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500`;
  const secondaryButtonStyles = `${buttonStyles} bg-gray-600 hover:bg-gray-700 focus:ring-gray-500`;

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      {/* Left Panel */}
      <div className="relative w-full md:w-1/2 flex flex-col justify-center items-start p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-[#6B73FF] to-[#4F46E5] text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to AI Companion
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-md">
            Create and chat with your personalized AI companions. Try the demo
            or sign in to start your journey.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-xs text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-8">Get Started</h2>
          <div className="flex flex-col gap-4">
            <button onClick={handleSignIn} className={primaryButtonStyles}>
              Sign In
            </button>
            <button onClick={handleSignUp} className={secondaryButtonStyles}>
              Sign Up
            </button>
            <DemoLoginButton />
          </div>
        </div>
      </div>
    </main>
  );
}
