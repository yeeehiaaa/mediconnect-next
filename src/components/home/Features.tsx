"use client";

import {
  CalendarDays,
  BrainCircuit,
  FileText,
  Pill,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Smart Appointment Booking",
    description:
      "Book appointments with verified doctors in just a few clicks.",
  },
  {
    icon: BrainCircuit,
    title: "AI Medical Assistant",
    description:
      "Receive intelligent guidance powered by artificial intelligence 24/7.",
  },
  {
    icon: FileText,
    title: "Electronic Medical Records",
    description:
      "Access your complete health history securely from anywhere.",
  },
  {
    icon: Pill,
    title: "Digital Prescriptions",
    description:
      "Doctors can send prescriptions instantly to your preferred pharmacy.",
  },
  {
    icon: FlaskConical,
    title: "Laboratory Integration",
    description:
      "View laboratory requests and results directly from your account.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Healthcare",
    description:
      "Your medical data is encrypted and protected with enterprise security.",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Platform Features
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900 md:text-5xl">
            Everything you need for
            <span className="text-violet-600"> modern healthcare</span>
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            MediConnect AI centralizes appointments, medical records,
            prescriptions, laboratory services and AI assistance in one secure
            platform.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-violet-300 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 transition group-hover:bg-violet-600">
                  <Icon
                    size={30}
                    className="text-violet-600 transition group-hover:text-white"
                  />
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}