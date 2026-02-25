import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";

export const Companions = ({ data }) => {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center pt-24 space-y-6">
        <div className="relative w-72 h-72">
          <Image
            fill
            src="/empty.png"
            alt="Empty"
            className="object-contain grayscale opacity-40"
          />
        </div>
        <p className="text-base font-medium text-muted-foreground/50 tracking-wide">
          No Companions Found
        </p>
      </div>
    );
  }

  return (
    <div className="main-section grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-10 lg:gap-12 pb-24 pt-2 px-3 md:px-8 max-w-[1400px] mx-auto">
      {data.map((item) => (
        <Card
          key={item.id}
          className="premium-card group relative overflow-hidden rounded-[20px] md:rounded-3xl"
        >
          <Link href={`/chat/${item.id}`} className="block h-full">
            <div className="relative h-[250px] sm:h-[320px] md:h-[420px] w-full overflow-hidden">
              <Image
                src={item.src}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover block transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

              <div className="absolute bottom-0 p-4 md:p-8 pb-4 md:pb-10 flex flex-col justify-end text-white">
                <h3 className="text-base sm:text-lg md:text-3xl font-extrabold tracking-tight md:tracking-tighter mb-0.5 md:mb-1 transition-transform duration-300 group-hover:-translate-y-1">
                  {item.name}
                </h3>
                <p className="hidden md:block text-sm font-medium text-white/60 line-clamp-2 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                  {item.description}
                </p>
                <div className="md:hidden flex items-center text-[11px] text-white/70 font-medium tracking-wide">
                  <MessagesSquare className="w-3 h-3 mr-1.5" />
                  {item._count.messages}
                </div>
              </div>
            </div>

            <CardFooter className="hidden md:flex items-center justify-between px-8 py-6 text-sm border-t border-white/5 bg-black/60 rounded-b-3xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold text-white shadow-md">
                  {item.username.charAt(0).toUpperCase()}
                </div>
                <p className="truncate max-w-[120px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  @{item.username}
                </p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-foreground/80 group-hover:bg-white/20 transition-colors duration-300">
                <MessagesSquare className="w-4 h-4" />
                {item._count.messages}
              </div>
            </CardFooter>
          </Link>

          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5 group-hover:ring-indigo-400/30 transition-all duration-500" />
        </Card>
      ))}
    </div>
  );
};

