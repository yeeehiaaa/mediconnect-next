"use client";

import Link from "next/link";
import { Menu, Phone } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-xl font-bold text-white">
            M
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              MediConnect
            </h1>

            <p className="text-xs text-gray-500">
              AI Healthcare
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}

        <nav className="hidden items-center gap-10 lg:flex">

          <Link
            href="/"
            className="font-medium text-gray-700 transition hover:text-violet-600"
          >
            Home
          </Link>

          <Link
            href="#services"
            className="font-medium text-gray-700 transition hover:text-violet-600"
          >
            Services
          </Link>

          <Link
            href="#doctors"
            className="font-medium text-gray-700 transition hover:text-violet-600"
          >
            Doctors
          </Link>

          <Link
            href="#about"
            className="font-medium text-gray-700 transition hover:text-violet-600"
          >
            About
          </Link>

          <Link
            href="#contact"
            className="font-medium text-gray-700 transition hover:text-violet-600"
          >
            Contact
          </Link>

        </nav>

        {/* Right Side */}

        <div className="hidden items-center gap-4 lg:flex">

          <button className="flex items-center gap-2 rounded-full border border-violet-200 px-5 py-3 text-sm font-medium text-violet-700 transition hover:bg-violet-50">
            <Phone size={17} />
            Emergency
          </button>

          <button className="rounded-full bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700">
            Get Started
          </button>

        </div>

        {/* Mobile */}

        <button className="lg:hidden">
          <Menu size={30} />
        </button>

      </div>
    </header>
  );
}