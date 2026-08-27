"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-600 py-24 text-white">

      <div className="mx-auto max-w-7xl px-6 text-center">

        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">
          <Sparkles size={16} />
          Healthcare powered by AI
        </span>


        <h2 className="mt-8 text-5xl font-extrabold leading-tight">
          Your health journey
          <br />
          starts with intelligence
        </h2>


        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-blue-100">
          Connect with doctors, get AI-powered health insights,
          and manage your medical journey in one intelligent platform.
        </p>


        <div className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">

          <Link
            href="/signup"
            className="
              inline-flex items-center justify-center gap-3
              rounded-full
              bg-white
              px-8 py-4
              font-semibold
              text-blue-700
              transition
              hover:scale-105
            "
          >
            Get Started
            <ArrowRight size={20} />
          </Link>


          <Link
            href="/ai"
            className="
              inline-flex items-center justify-center
              rounded-full
              border border-white/40
              bg-white/10
              px-8 py-4
              font-semibold
              backdrop-blur
              transition
              hover:bg-white/20
            "
          >
            Explore AI Assistant
          </Link>

        </div>

      </div>

    </section>
  );
}