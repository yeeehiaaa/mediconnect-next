"use client";

import {
  BrainCircuit,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";


export default function Footer() {

  return (
    <footer className="bg-gray-950 py-16 text-gray-300">

      <div className="mx-auto max-w-7xl px-6">


        <div className="grid gap-12 md:grid-cols-4">


          {/* Brand */}
          <div>

            <div className="flex items-center gap-3">

              <div className="
                flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-violet-600
                text-white
              ">
                <BrainCircuit size={24}/>
              </div>


              <h3 className="text-2xl font-bold text-white">
                MediConnect AI
              </h3>

            </div>


            <p className="mt-6 leading-7 text-gray-400">
              Intelligent healthcare solutions connecting
              patients, doctors and artificial intelligence.
            </p>

          </div>



          {/* Platform */}
          <div>

            <h4 className="mb-5 font-bold text-white">
              Platform
            </h4>


            <ul className="space-y-3">

              <li className="hover:text-white cursor-pointer">
                AI Assistant
              </li>

              <li className="hover:text-white cursor-pointer">
                Doctors
              </li>

              <li className="hover:text-white cursor-pointer">
                Telemedicine
              </li>

              <li className="hover:text-white cursor-pointer">
                Health Tracking
              </li>

            </ul>

          </div>




          {/* Company */}
          <div>

            <h4 className="mb-5 font-bold text-white">
              Company
            </h4>


            <ul className="space-y-3">

              <li className="hover:text-white cursor-pointer">
                About
              </li>

              <li className="hover:text-white cursor-pointer">
                Careers
              </li>

              <li className="hover:text-white cursor-pointer">
                Privacy
              </li>

              <li className="hover:text-white cursor-pointer">
                Terms
              </li>

            </ul>

          </div>




          {/* Contact */}
          <div>

            <h4 className="mb-5 font-bold text-white">
              Contact
            </h4>


            <div className="space-y-4">


              <p className="flex items-center gap-3">
                <Mail size={18}/>
                contact@mediconnect.ai
              </p>


              <p className="flex items-center gap-3">
                <Phone size={18}/>
                +213 XX XX XX XX
              </p>


              <p className="flex items-center gap-3">
                <MapPin size={18}/>
                Algeria
              </p>


            </div>

          </div>


        </div>




        <div className="
          mt-14
          border-t border-white/10
          pt-8
          text-center
          text-sm
          text-gray-500
        ">

          © {new Date().getFullYear()} MediConnect AI.
          All rights reserved.

        </div>


      </div>

    </footer>
  );
}