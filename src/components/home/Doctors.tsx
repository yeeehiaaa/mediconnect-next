"use client";

import { Star, MapPin } from "lucide-react";

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    city: "Algiers",
    image: "/images/doctors/doctor1.jpg",
  },
  {
    name: "Dr. Ahmed Benali",
    specialty: "Neurologist",
    rating: 4.8,
    city: "Oran",
    image: "/images/doctors/doctor2.jpg",
  },
  {
    name: "Dr. Lina Martin",
    specialty: "Pediatrician",
    rating: 5.0,
    city: "Constantine",
    image: "/images/doctors/doctor3.jpg",
  },
];

export default function Doctors() {
  return (
    <section
      id="doctors"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Our Doctors
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            Meet Our Trusted Specialists
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-500">
            Connect with experienced healthcare professionals across Algeria.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="h-80 w-full object-cover"
              />

              <div className="p-8">

                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {doctor.name}
                  </h3>

                  <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                    <Star size={15} fill="currentColor" />
                    {doctor.rating}
                  </div>
                </div>

                <p className="mt-3 font-medium text-violet-600">
                  {doctor.specialty}
                </p>

                <div className="mt-5 flex items-center gap-2 text-gray-500">
                  <MapPin size={18} />
                  {doctor.city}
                </div>

                <button className="mt-8 w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700">
                  Book Appointment
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}