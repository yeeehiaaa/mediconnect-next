"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed Benali",
    role: "Patient",
    image: "https://i.pravatar.cc/150?img=12",
    text: "MediConnect AI made booking appointments incredibly simple. The AI assistant answered my questions instantly.",
  },
  {
    name: "Dr. Sarah Kaci",
    role: "Cardiologist",
    image: "https://i.pravatar.cc/150?img=32",
    text: "Managing patients, prescriptions and consultations from one platform has completely changed my workflow.",
  },
  {
    name: "Yasmine B.",
    role: "Patient",
    image: "https://i.pravatar.cc/150?img=47",
    text: "Having all my medical records, prescriptions and laboratory results in one secure place is amazing.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Testimonials
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900 md:text-5xl">
            Trusted by
            <span className="text-violet-600"> thousands of users</span>
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            Hear what patients and healthcare professionals say about
            MediConnect AI.
          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {testimonials.map((item) => (

            <div
              key={item.name}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex">

                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

              <p className="mt-6 leading-8 text-gray-600">
                "{item.text}"
              </p>

              <div className="mt-8 flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>

                  <h4 className="font-bold text-gray-900">
                    {item.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {item.role}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}