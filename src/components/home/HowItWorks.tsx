"use client";

import { UserPlus, Search, CalendarCheck2, HeartPulse } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create your account",
    description:
      "Register securely as a patient, doctor, pharmacist or healthcare provider.",
  },
  {
    icon: Search,
    number: "02",
    title: "Find the right doctor",
    description:
      "Search by specialty, location, ratings and availability.",
  },
  {
    icon: CalendarCheck2,
    number: "03",
    title: "Book instantly",
    description:
      "Choose an available time slot and receive instant confirmation.",
  },
  {
    icon: HeartPulse,
    number: "04",
    title: "Receive healthcare",
    description:
      "Consult your doctor, access prescriptions, lab results and AI assistance.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Simple Process
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900 md:text-5xl">
            Healthcare in
            <span className="text-violet-600"> four simple steps</span>
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            MediConnect AI simplifies the entire healthcare journey,
            from registration to treatment.
          </p>

        </div>

        <div className="relative mt-20">

          <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 rounded-full bg-violet-200 lg:block"></div>

          <div className="space-y-16">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className={`flex flex-col items-center gap-10 lg:flex-row ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">

                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                        <Icon className="text-violet-600" size={30} />
                      </div>

                      <p className="mt-6 text-sm font-bold tracking-widest text-violet-500">
                        STEP {step.number}
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-gray-900">
                        {step.title}
                      </h3>

                      <p className="mt-4 leading-7 text-gray-600">
                        {step.description}
                      </p>

                    </div>
                  </div>

                  <div className="hidden h-8 w-8 rounded-full border-4 border-white bg-violet-600 shadow-xl lg:block"></div>

                  <div className="flex-1"></div>
                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}