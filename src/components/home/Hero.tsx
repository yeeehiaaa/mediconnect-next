"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 pt-36 pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row">
          {/* Texte */}
          <div className="flex-1">
            <span className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
              🚀 AI-Powered Healthcare Platform
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight text-gray-900 lg:text-7xl">
              Healthcare
              <br />
              <span className="text-violet-600">Made Smarter</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">
              Find doctors, book appointments, access your medical records,
              receive AI assistance and manage your health from one secure
              platform.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                href="/register"
                className="rounded-full bg-violet-600 px-8 py-4 font-semibold text-white transition hover:bg-violet-700"
              >
                Get Started
              </Link>

              <Link
                href="/doctors"
                className="rounded-full border border-violet-200 px-8 py-4 font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Find a Doctor
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex flex-1 justify-center">
            {/* Glow */}
            <div className="absolute h-[450px] w-[450px] rounded-full bg-violet-300/40 blur-3xl" />

            {/* Card Top */}
            <div className="absolute left-0 top-10 z-20 rounded-2xl bg-white p-4 shadow-xl">
              <p className="text-sm text-gray-500">Available Doctors</p>
              <h3 className="mt-1 text-2xl font-bold text-violet-600">
                250+
              </h3>
            </div>

            {/* Card Bottom */}
            <div className="absolute bottom-10 right-0 z-20 rounded-2xl bg-white p-4 shadow-xl">
              <p className="text-sm text-gray-500">Patients Served</p>
              <h3 className="mt-1 text-2xl font-bold text-green-600">
                120K+
              </h3>
            </div>

            {/* Doctor */}
            <img
              src="/images/doctor.png"
              alt="Doctor"
              className="relative z-10 w-[520px] max-w-full"
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          <div className="rounded-2xl bg-violet-50 p-6 text-center">
            <h3 className="text-4xl font-bold text-violet-600">250+</h3>
            <p className="mt-2 text-gray-600">Doctors</p>
          </div>

          <div className="rounded-2xl bg-violet-50 p-6 text-center">
            <h3 className="text-4xl font-bold text-violet-600">120K+</h3>
            <p className="mt-2 text-gray-600">Patients</p>
          </div>

          <div className="rounded-2xl bg-violet-50 p-6 text-center">
            <h3 className="text-4xl font-bold text-violet-600">98%</h3>
            <p className="mt-2 text-gray-600">Satisfaction</p>
          </div>

          <div className="rounded-2xl bg-violet-50 p-6 text-center">
            <h3 className="text-4xl font-bold text-violet-600">24/7</h3>
            <p className="mt-2 text-gray-600">AI Assistant</p>
          </div>
        </div>
      </section>
    </>
  );
}