"use client";

import {
  Brain,
  CalendarCheck,
  FileText,
  Pill,
  Microscope,
  HeartPulse,
} from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Medical Assistant",
    description:
      "Get intelligent health guidance powered by artificial intelligence.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Booking",
    description:
      "Book appointments with certified doctors in just a few clicks.",
  },
  {
    icon: FileText,
    title: "Electronic Medical Records",
    description:
      "Securely access your complete medical history anytime.",
  },
  {
    icon: Pill,
    title: "Digital Prescriptions",
    description:
      "Receive and manage prescriptions electronically.",
  },
  {
    icon: Microscope,
    title: "Laboratory Results",
    description:
      "View your laboratory analyses and reports online.",
  },
  {
    icon: HeartPulse,
    title: "Health Monitoring",
    description:
      "Track your health with personalized insights and reminders.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-gradient-to-b from-violet-50 to-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Our Services
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            Everything You Need
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-500">
            MediConnect AI brings doctors, patients, pharmacies and laboratories
            together in one intelligent healthcare ecosystem.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group rounded-3xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-3 hover:shadow-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                  <Icon size={30} />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-gray-900">
                  {service.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-500">
                  {service.description}
                </p>

                <button className="mt-8 rounded-full bg-violet-100 px-5 py-3 font-semibold text-violet-700 transition hover:bg-violet-600 hover:text-white">
                  Learn More →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}