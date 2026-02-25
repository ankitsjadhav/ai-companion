"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export const FloatingDock = ({ items, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed left-6 top-1/2 -translate-y-1/2 z-50",
        "hidden md:flex flex-col gap-3",
        "px-2.5 py-4 rounded-full",
        "bg-zinc-950/80 backdrop-blur-3xl",
        "border border-white/10",
        "shadow-[0_0_30px_rgba(0,0,0,0.6),_inset_0_1px_1px_rgba(255,255,255,0.08),_inset_0_-1px_2px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {items.map((item) => (
        <DockItem key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

const DockItem = ({ title, icon, href, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      onClick={onClick}
      className="relative group block outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.15 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-full z-10",
          "transition-colors duration-300",
          isHovered ? "bg-secondary" : "bg-transparent"
        )}
      >
        {}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-full bg-secondary/50 blur-sm -z-10"
            />
          )}
        </AnimatePresence>

        {}
        <div className={cn(
          "h-5 w-5 transition-colors duration-300 z-20",
          isHovered ? "text-primary dark:text-white" : "text-zinc-400"
        )}>
          {icon}
        </div>
      </motion.div>

      {}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: "-50%" }}
            animate={{ opacity: 1, x: 0, y: "-50%" }}
            exit={{ opacity: 0, x: 10, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute left-[calc(100%+16px)] top-1/2 z-50
                       px-3 py-1.5 rounded-md text-sm font-semibold tracking-wide whitespace-nowrap
                       bg-zinc-900 border border-zinc-700/50
                       text-purple-50 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
    </a>
  );
};

