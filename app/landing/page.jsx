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
    <main className="flex flex-col md:flex-row min-h-screen bg-zinc-950 font-sans selection:bg-purple-500/30">
      <div className="relative w-full md:w-3/5 flex flex-col justify-center items-start p-10 sm:p-16 lg:p-24 overflow-hidden border-r border-white/5">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl">
          <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-sm font-semibold text-purple-300 mb-8 tracking-wide">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2.5 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
            Cortex Stream
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 mb-6 tracking-tight leading-tight">
            Meet Your New <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
              Digital Companion.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-12 leading-relaxed font-light">
            Create and customize AI companions with distinct personalities and intelligent conversational behavior. Built on a scalable dual model architecture.
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-zinc-500 text-sm font-medium">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Real Time AI Conversations
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Fully Customizable Personas
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Persistent Memory
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Secure Authentication & Billing
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full md:w-2/5 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 bg-zinc-900/40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950/80 pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Get Started</h2>
            <p className="text-zinc-400 font-light">Join today or try our live demo</p>
          </div>

          <div className="flex flex-col gap-5">
            <button
              onClick={handleSignUp}
              className="w-full px-6 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transform hover:-translate-y-0.5"
            >
              Create an Account
            </button>

            <button
              onClick={handleSignIn}
              className="w-full px-6 py-4 rounded-xl font-medium text-white bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
            >
              Sign In
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-500 text-sm font-light uppercase tracking-wider">Or explore instantly</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <div className="relative group w-full">
              <div className="relative w-full flex items-center justify-center">
                <DemoLoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
