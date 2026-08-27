"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  MessageCircle,
  Settings,
  Moon,
  ChevronDown,
} from "lucide-react";

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="flex h-24 items-center gap-8 px-10">

        {/* Left */}

        <motion.div
          initial={false}
          animate={{
            width: searchFocused ? 0 : 300,
            opacity: searchFocused ? 0 : 1,
            marginRight: searchFocused ? 0 : 24,
          }}
          transition={{
            duration: 0.35,
            ease: "easeInOut",
          }}
          className="overflow-hidden whitespace-nowrap flex-shrink-0"
        >
          <p className="text-sm font-semibold uppercase tracking-[3px] text-violet-600">
            MediConnect AI
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
            Health Dashboard
          </h1>
        </motion.div>

        {/* Search */}

        <motion.div
          initial={false}
          animate={{
            flexGrow: searchFocused ? 1 : 0,
          }}
          transition={{
            duration: 0.35,
            ease: "easeInOut",
          }}
          className="min-w-0 flex-1"
        >
          <div className="relative w-full">

            <label
              htmlFor="dashboard-search"
              className="absolute left-5 top-1/2 z-10 -translate-y-1/2 cursor-text"
            >
              <Search
                size={20}
                className="text-slate-400"
              />
            </label>

            <input
              id="dashboard-search"
              type="text"
              placeholder="Search doctors, medications, appointments..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-100 pl-14 pr-5 text-[15px] text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition-all duration-300 focus:border-violet-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-violet-100"
            />

          </div>
        </motion.div>

        {/* Right */}

        <div className="ml-auto flex shrink-0 items-center gap-4">

          {[
            { icon: Moon },
            { icon: MessageCircle, dot: true },
            { icon: Bell, badge: "3" },
            { icon: Settings },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={index}
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-violet-50 hover:text-violet-600 hover:shadow-md"
              >
                <Icon size={20} />

                {item.dot && (
                  <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-blue-500" />
                )}

                {item.badge && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mx-2 h-10 w-px bg-slate-200" />

          {/* Profile */}

          <button
            className="flex shrink-0 items-center gap-4 rounded-2xl bg-white px-3 py-2 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:shadow-md"
          >
            <img
              src="/avatars/patient.png"
              alt="Profile"
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
            />

            <div className="hidden text-left xl:block">
              <h3 className="text-[15px] font-semibold text-slate-900">
                Yahia
              </h3>

              <p className="text-xs text-slate-500">
                Premium Patient
              </p>
            </div>

            <ChevronDown
              size={18}
              className="text-slate-400"
            />
          </button>

        </div>

      </div>
    </header>
  );
}