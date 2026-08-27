"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I book an appointment?",
    answer:
      "Search for a doctor, choose an available time slot, and confirm your appointment in just a few clicks.",
  },
  {
    question: "Is my medical information secure?",
    answer:
      "Yes. Your data is encrypted and protected using industry-standard security practices.",
  },
  {
    question: "Can I access my prescriptions online?",
    answer:
      "Absolutely. All prescriptions are stored securely in your personal account and can be downloaded anytime.",
  },
  {
    question: "Does MediConnect AI include an AI assistant?",
    answer:
      "Yes. Our AI assistant helps explain symptoms, medications, laboratory results and guides you through your healthcare journey.",
  },
  {
    question: "Can doctors manage their patients online?",
    answer:
      "Yes. Doctors can manage appointments, consultations, prescriptions, laboratory requests and medical records from a unified dashboard.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-4xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            Got Questions?
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about MediConnect AI.
          </p>

        </div>

        <div className="mt-14 space-y-5">

          {faqs.map((faq, index) => {

            const isOpen = open === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >

                <button
                  onClick={() =>
                    setOpen(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >

                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`transition duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />

                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-6 py-5 text-gray-600 leading-7">
                    {faq.answer}
                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}