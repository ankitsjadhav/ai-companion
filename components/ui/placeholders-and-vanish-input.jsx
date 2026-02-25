"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  className
}) {
  const [value, setValue] = useState("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) return;

    const id = setInterval(() => {
      setCurrentPlaceholder((p) => (p + 1) % placeholders.length);
    }, 4000);

    return () => clearInterval(id);
  }, [placeholders.length, value]);

  const handleChange = useCallback(
    (e) => {
      if (animating) return;
      setValue(e.target.value);
      onChange?.(e);
    },
    [animating, onChange]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!value || animating) return;

      setAnimating(true);
      onSubmit?.(e);

      setTimeout(() => {
        setValue("");
        setAnimating(false);
      }, 300);
    },
    [value, animating, onSubmit]
  );

  const buttonDisabled = useMemo(() => !value, [value]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative w-full max-w-xl mx-auto h-12 rounded-full overflow-hidden transition-all duration-200",
        "bg-transparent",
        className
      )}
    >
      <motion.input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        type="text"
        animate={animating ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "w-full h-full bg-transparent border-none focus:outline-none",
          "text-sm sm:text-base px-4 sm:px-10 pr-20",
          "dark:text-white text-black"
        )}
      />

      <button
        disabled={buttonDisabled}
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full transition-all duration-200 flex items-center justify-center bg-black dark:bg-zinc-900 disabled:bg-gray-200 dark:disabled:bg-zinc-700"
      >
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <motion.path
            d="M5 12h14"
            animate={{ pathLength: value ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />
          <path d="M13 18l6-6-6-6" />
        </motion.svg>
      </button>

      <div className="absolute inset-0 flex items-center pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              key={currentPlaceholder}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.6 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm sm:text-base pl-4 sm:pl-10 truncate w-[calc(100%-2rem)] text-neutral-500 dark:text-zinc-500"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

