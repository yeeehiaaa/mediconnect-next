"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  LayoutDashboard,
  CalendarDays,
  BrainCircuit,
  HeartPulse,
  FlaskConical,
  FileText,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

const mainMenu = [
  {
    title: "Dashboard",
    href: "/dashboard/patient",
    icon: LayoutDashboard,
  },
  {
    title: "Appointments",
    href: "/dashboard/patient/appointments",
    icon: CalendarDays,
  },
  {
    title: "AI Assistant",
    href: "/dashboard/patient/ai-assistant",
    icon: BrainCircuit,
  },
];

const healthMenu = [
  {
    title: "Medical Record",
    href: "/dashboard/patient/medical-record",
    icon: HeartPulse,
  },
  {
    title: "Laboratory",
    href: "/dashboard/patient/laboratory",
    icon: FlaskConical,
  },
  {
    title: "Prescriptions",
    href: "/dashboard/patient/prescriptions",
    icon: FileText,
  },
];

type Profile = {
  id: string;
  authUserId: string;
  userType: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  accountStatus: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);

        /*
         * ==========================================
         * 1. GET CURRENT SUPABASE SESSION
         * ==========================================
         */

        const {
          data: sessionData,
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error(
            "SESSION ERROR:",
            sessionError
          );

          if (mounted) {
            router.replace("/login");
          }

          return;
        }

        const session = sessionData.session;

        /*
         * ==========================================
         * 2. NO SESSION
         * ==========================================
         */

        if (!session) {
          console.error(
            "No active Supabase session."
          );

          if (mounted) {
            router.replace("/login");
          }

          return;
        }

        /*
         * ==========================================
         * 3. GET ACCESS TOKEN
         * ==========================================
         */

        const accessToken = session.access_token;

        if (!accessToken) {
          console.error(
            "No access token found."
          );

          if (mounted) {
            router.replace("/login");
          }

          return;
        }

        /*
         * ==========================================
         * 4. CALL PROFILE API
         * ==========================================
         */

        const response = await fetch(
          "/api/auth/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type":
                "application/json",
            },
            cache: "no-store",
          }
        );

        /*
         * ==========================================
         * 5. READ RESPONSE SAFELY
         * ==========================================
         */

        const text = await response.text();

        let result: any = {};

        try {
          result = text
            ? JSON.parse(text)
            : {};
        } catch {
          console.error(
            "Profile API returned invalid JSON:",
            text
          );

          if (mounted) {
            setLoadingProfile(false);
          }

          return;
        }

        /*
         * ==========================================
         * 6. API ERROR
         * ==========================================
         */

        if (!response.ok) {
          console.error(
            "Profile API error:",
            result
          );

          /*
           * IMPORTANT:
           *
           * Don't immediately redirect on every
           * temporary API error.
           *
           * The previous code was causing:
           *
           * Dashboard
           * ↓
           * API temporary error
           * ↓
           * router.replace("/login")
           *
           * which looked like the login was broken.
           */

          if (
            response.status === 401 &&
            mounted
          ) {
            /*
             * Try refreshing the session once.
             */

            const {
              data: refreshData,
              error: refreshError,
            } =
              await supabase.auth.refreshSession();

            if (
              !refreshError &&
              refreshData.session
            ) {
              const refreshedToken =
                refreshData.session.access_token;

              const retryResponse =
                await fetch(
                  "/api/auth/profile",
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${refreshedToken}`,
                      "Content-Type":
                        "application/json",
                    },
                    cache: "no-store",
                  }
                );

              const retryText =
                await retryResponse.text();

              let retryResult: any = {};

              try {
                retryResult = retryText
                  ? JSON.parse(retryText)
                  : {};
              } catch {
                retryResult = {};
              }

              if (retryResponse.ok) {
                if (mounted) {
                  setProfile(
                    retryResult.profile
                  );
                  setLoadingProfile(false);
                }

                return;
              }
            }

            /*
             * Only redirect if the session is
             * really invalid after refresh.
             */

            if (mounted) {
              await supabase.auth.signOut();
              router.replace("/login");
            }

            return;
          }

          /*
           * For non-auth errors, keep dashboard
           * mounted instead of immediately sending
           * the user to login.
           */

          if (mounted) {
            setLoadingProfile(false);
          }

          return;
        }

        /*
         * ==========================================
         * 7. PROFILE SUCCESS
         * ==========================================
         */

        if (!result.profile) {
          console.error(
            "Profile missing from API response:",
            result
          );

          if (mounted) {
            setLoadingProfile(false);
          }

          return;
        }

        if (mounted) {
          setProfile(result.profile);
          setLoadingProfile(false);
        }
      } catch (error) {
        console.error(
          "LOAD PROFILE ERROR:",
          error
        );

        if (mounted) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [router]);

  /*
   * ==========================================
   * LOGOUT
   * ==========================================
   */

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const {
        error,
      } = await supabase.auth.signOut();

      if (error) {
        console.error(
          "Logout error:",
          error
        );

        setLoggingOut(false);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );

      setLoggingOut(false);
    }
  };

  /*
   * ==========================================
   * DISPLAY NAME
   * ==========================================
   */

  const firstName =
    profile?.firstName?.trim() || "";

  const lastName =
    profile?.lastName?.trim() || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  const displayName =
    fullName ||
    profile?.email?.split("@")[0] ||
    "Patient";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(
      0
    )}`.toUpperCase() || "P";

  return (
    <aside className="flex h-full min-h-full flex-col">
      {/* ==========================================
          LOGO
      ========================================== */}

      <Link
        href="/dashboard/patient"
        className="mb-14 flex items-center gap-4"
      >
        <motion.div
          whileHover={{
            rotate: 8,
            scale: 1.08,
          }}
          transition={{
            duration: 0.3,
          }}
          className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 shadow-xl"
        >
          <Sparkles
            size={28}
            className="text-white"
          />
        </motion.div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            MediConnect
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            AI Healthcare
          </p>
        </div>
      </Link>

      {/* ==========================================
          MAIN MENU
      ========================================== */}

      <div>
        <p className="mb-5 pl-2 text-xs font-bold uppercase tracking-[4px] text-slate-400">
          Main Menu
        </p>

        <div className="space-y-3">
          {mainMenu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
              >
                <motion.div
                  whileHover={{
                    x: 6,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className={`group flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl"
                      : "text-slate-600 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={21} />

                    <span className="font-semibold">
                      {item.title}
                    </span>
                  </div>

                  <ChevronRight
                    size={18}
                    className={`transition-all duration-300 ${
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          HEALTH
      ========================================== */}

      <div className="mt-12">
        <p className="mb-5 pl-2 text-xs font-bold uppercase tracking-[4px] text-slate-400">
          Health
        </p>

        <div className="space-y-3">
          {healthMenu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
              >
                <motion.div
                  whileHover={{
                    x: 6,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className={`group flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl"
                      : "text-slate-600 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={21} />

                    <span className="font-semibold">
                      {item.title}
                    </span>
                  </div>

                  <ChevronRight
                    size={18}
                    className={`transition-all duration-300 ${
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          DIVIDER
      ========================================== */}

      <div className="my-10 h-px rounded-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* ==========================================
          AI CARD
      ========================================== */}

      <motion.div
        whileHover={{
          scale: 1.02,
        }}
        transition={{
          duration: 0.25,
        }}
        className="rounded-[30px] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-6 text-white shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <BrainCircuit size={24} />
          </div>

          <div>
            <h3 className="font-bold">
              AI Assistant
            </h3>

            <p className="text-sm text-violet-100">
              Available 24/7
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-violet-100">
          Ask our AI about symptoms,
          medications, appointments or
          your medical history.
        </p>

        <Link
          href="/patient/ai-assistant"
          className="mt-6 block w-full rounded-2xl bg-white py-3 text-center font-semibold text-violet-700 transition hover:scale-[1.02] hover:bg-violet-50"
        >
          Open AI Assistant
        </Link>
      </motion.div>

      {/* ==========================================
          BOTTOM USER CARD
      ========================================== */}

      <div className="mt-auto pt-10">
        <motion.div
          whileHover={{
            y: -4,
          }}
          transition={{
            duration: 0.25,
          }}
          className="rounded-[30px] bg-white p-6 shadow-lg"
        >
          {/* USER */}

          <div className="flex items-center gap-4">
            {loadingProfile ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                <Loader2
                  size={22}
                  className="animate-spin text-violet-600"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold text-white ring-2 ring-violet-100">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-900">
                {loadingProfile
                  ? "Loading..."
                  : displayName}
              </h3>

              <p className="truncate text-sm text-slate-500">
                {profile?.email ||
                  "Patient"}
              </p>
            </div>
          </div>

          {/* BUTTONS */}

          <div className="mt-7 space-y-3">
            <Link
  href="/dashboard/patient/profile"
  className="flex w-full items-center gap-4 rounded-2xl bg-slate-100 px-5 py-4 text-slate-700 transition-all duration-300 hover:bg-violet-50 hover:text-violet-600"
>
  <User size={20} />

  <span className="font-medium">
    My Profile
  </span>
</Link>

            <Link
              href="/dashboard/patient/settings"
              className="flex w-full items-center gap-4 rounded-2xl bg-slate-100 px-5 py-4 text-slate-700 transition-all duration-300 hover:bg-violet-50 hover:text-violet-600"
            >
              <Settings size={20} />

              <span className="font-medium">
                Settings
              </span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-4 rounded-2xl bg-red-50 px-5 py-4 text-red-500 transition-all duration-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2
                  size={20}
                  className="animate-spin"
                />
              ) : (
                <LogOut size={20} />
              )}

              <span className="font-medium">
                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}