import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default function PatientDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-[300px] shrink-0 border-r border-slate-200 bg-slate-50 lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        {/* Main */}
        <section className="flex min-w-0 flex-1 flex-col">

          <Topbar />

          <div className="flex-1 p-6 lg:p-8">
            <DashboardContent />
          </div>

        </section>

      </div>
    </main>
  );
}