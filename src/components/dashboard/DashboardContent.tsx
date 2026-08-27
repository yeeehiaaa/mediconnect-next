"use client";

import {
  HeartPulse,
  Activity,
  BrainCircuit,
  Weight,
} from "lucide-react";

import SmallStatCard from "./SmallStatCard";
import ECGChart from "./ECGChart";
import RightSidebar from "./RightSidebar";
import WelcomeCard from "./WelcomeCard";
import UpcomingAppointments from "./UpcomingAppointments";
import HealthOverview from "./HealthOverview";

export default function DashboardContent() {
  return (
<div className="space-y-8">
  <WelcomeCard />
 

      {/* Stats */}

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
  
        <SmallStatCard
          title="Heart Rate"
          value="72 bpm"
          icon={HeartPulse}
          color="bg-gradient-to-br from-red-400 to-pink-500"
          percentage="+2.4%"
        />

        <SmallStatCard
          title="Blood Pressure"
          value="120 / 80"
          icon={Activity}
          color="bg-gradient-to-br from-blue-500 to-cyan-400"
          percentage="+1.3%"
        />

        <SmallStatCard
          title="BMI"
          value="22.6"
          icon={Weight}
          color="bg-gradient-to-br from-green-500 to-emerald-400"
          percentage="+0.8%"
        />

        <SmallStatCard
          title="AI Score"
          value="96%"
          icon={BrainCircuit}
          color="bg-gradient-to-br from-violet-600 to-indigo-500"
          percentage="+5.1%"
        />

      </div>

      {/* Main Content */}

<div className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_360px] items-start">
          {/* Left */}

        <div className="xl:col-span-2">
          <ECGChart />
        </div>

        {/* Right */}

        <RightSidebar />

      </div>

      <div className="space-y-8">
  <UpcomingAppointments />
  <HealthOverview />
</div>

    </div>
  );
}