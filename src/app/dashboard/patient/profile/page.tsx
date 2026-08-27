"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  VenusAndMars,
  ShieldCheck,
  HeartPulse,
  AlertCircle,
  Loader2,
  Pencil,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

// ======================================================
// TYPES
// ======================================================

interface Profile {
  id: string;
  authUserId: string;

  userType: string;
  email: string;

  firstName: string;
  lastName: string;

  nationalId: string | null;

  gender:
    | "MALE"
    | "FEMALE"
    | null;

  birthDate: string | null;

  preferredLanguage: string | null;

  phone: string | null;

  avatarUrl: string | null;

  address: string | null;
  city: string | null;
  wilaya: string | null;
  postalCode: string | null;

  latitude: number | null;
  longitude: number | null;

  isVerified: boolean;

  accountStatus: string;
}

interface Patient {
  id: string;
  profileId: string;

  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;

  guardianFirstName: string | null;
  guardianLastName: string | null;
  guardianEmail: string | null;
  guardianPhone: string | null;
  guardianRelation: string | null;

  bloodType: string | null;
  allergies: string | null;
  chronicConditions: string | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  wilaya: string;
  postalCode: string;
  preferredLanguage: string;
  gender: "" | "MALE" | "FEMALE";
  birthDate: string;
}

// ======================================================
// PAGE
// ======================================================

export default function PatientProfilePage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState<FormData>({
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      wilaya: "",
      postalCode: "",
      preferredLanguage: "fr",
      gender: "",
      birthDate: "",
    });

  // ======================================================
  // LOAD PROFILE
  // ======================================================

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          "SESSION ERROR:",
          sessionError
        );

        setError(
          "Unable to retrieve your session."
        );

        return;
      }

      const session =
        sessionData.session;

      if (!session) {
        setError(
          "You are not authenticated."
        );

        return;
      }

      const response =
        await fetch(
          "/api/patient/profile",
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },

            cache: "no-store",
          }
        );

      const result =
        await response.json();

      console.log(
        "PATIENT PROFILE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to load your profile."
        );
      }


// --------------------------------------------------
// UPDATE LOCAL PROFILE
// --------------------------------------------------

if (result.profile) {
  setProfile(result.profile);
}

// --------------------------------------------------
// REFRESH SUPABASE SESSION
// --------------------------------------------------
//
// This makes the updated user_metadata available
// immediately on the client.
//

const {
  error: refreshError,
} = await supabase.auth.refreshSession();

if (refreshError) {
  console.warn(
    "SESSION REFRESH WARNING:",
    refreshError
  );
}

// --------------------------------------------------
// SUCCESS
// --------------------------------------------------

setEditing(false);

setSuccess(
  "Your profile has been updated successfully."
);

setTimeout(() => {
  setSuccess("");
}, 4000);




      if (!result.profile) {
        throw new Error(
          "Profile data was not returned."
        );
      }

      const loadedProfile =
        result.profile as Profile;

      setProfile(
        loadedProfile
      );

      setPatient(
        result.patient ?? null
      );

      // -----------------------------------------------
      // PREPARE FORM
      // -----------------------------------------------

      setFormData({
        firstName:
          loadedProfile.firstName ||
          "",

        lastName:
          loadedProfile.lastName ||
          "",

        phone:
          loadedProfile.phone ||
          "",

        address:
          loadedProfile.address ||
          "",

        city:
          loadedProfile.city ||
          "",

        wilaya:
          loadedProfile.wilaya ||
          "",

        postalCode:
          loadedProfile.postalCode ||
          "",

        preferredLanguage:
          loadedProfile.preferredLanguage ||
          "fr",

        gender:
          loadedProfile.gender ||
          "",

        birthDate:
          loadedProfile.birthDate
            ? loadedProfile.birthDate.substring(
                0,
                10
              )
            : "",
      });
    } catch (error) {
      console.error(
        "PROFILE LOADING ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadProfile();
  }, []);

  // ======================================================
  // UPDATE FORM
  // ======================================================

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setFormData(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  }

  // ======================================================
  // SAVE
  // ======================================================

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (
        !formData.firstName.trim()
      ) {
        setError(
          "First name is required."
        );

        return;
      }

      if (
        !formData.lastName.trim()
      ) {
        setError(
          "Last name is required."
        );

        return;
      }

      // -----------------------------------------------
      // SESSION
      // -----------------------------------------------

      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (
        sessionError ||
        !sessionData.session
      ) {
        setError(
          "Your authentication session is invalid."
        );

        return;
      }

      const session =
        sessionData.session;

      // -----------------------------------------------
      // UPDATE API
      // -----------------------------------------------

      const response =
        await fetch(
          "/api/patient/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.access_token}`,
            },

            body: JSON.stringify({
              firstName:
                formData.firstName,

              lastName:
                formData.lastName,

              phone:
                formData.phone,

              address:
                formData.address,

              city:
                formData.city,

              wilaya:
                formData.wilaya,

              postalCode:
                formData.postalCode,

              preferredLanguage:
                formData.preferredLanguage,

              gender:
                formData.gender || null,

              birthDate:
                formData.birthDate ||
                null,
            }),
          }
        );

      const result =
        await response.json();

      console.log(
        "UPDATE PROFILE RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to update your profile."
        );
      }

      // -----------------------------------------------
      // UPDATE LOCAL DATA
      // -----------------------------------------------

      if (result.profile) {
        setProfile(
          result.profile
        );
      }

      setEditing(false);

      setSuccess(
        "Your profile has been updated successfully."
      );

      // Remove success message after 4 sec
      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (error) {
      console.error(
        "SAVE PROFILE ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  function handleCancel() {
    if (!profile) {
      return;
    }

    setFormData({
      firstName:
        profile.firstName || "",

      lastName:
        profile.lastName || "",

      phone:
        profile.phone || "",

      address:
        profile.address || "",

      city:
        profile.city || "",

      wilaya:
        profile.wilaya || "",

      postalCode:
        profile.postalCode || "",

      preferredLanguage:
        profile.preferredLanguage ||
        "fr",

      gender:
        profile.gender || "",

      birthDate:
        profile.birthDate
          ? profile.birthDate.substring(
              0,
              10
            )
          : "",
    });

    setEditing(false);
    setError("");
  }

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-10">

        <div className="mx-auto max-w-6xl">

          <div className="flex items-center gap-3">

            <Loader2
              size={22}
              className="animate-spin text-violet-600"
            />

            <span className="font-medium text-slate-600">
              Loading your profile...
            </span>

          </div>

        </div>

      </main>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

        <div className="w-full max-w-lg rounded-[32px] bg-white p-10 text-center shadow-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">

            <AlertCircle size={30} />

          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Unable to load your profile
          </h1>

          <p className="mt-3 text-slate-500">
            {error ||
              "Profile information is unavailable."}
          </p>

          <button
            onClick={loadProfile}
            className="mt-8 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
          >
            Try Again
          </button>

        </div>

      </main>
    );
  }

  // ======================================================
  // DISPLAY VALUES
  // ======================================================

  const fullName =
    `${profile.firstName} ${profile.lastName}`;

  const birthDate =
    profile.birthDate
      ? new Date(
          profile.birthDate
        ).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )
      : "Not provided";

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-10">

      <div className="mx-auto max-w-6xl">

        {/* BACK */}

        <Link
          href="/dashboard/patient"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* ALERTS */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <AlertCircle
              size={20}
            />

            <span>{error}</span>

          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">

            <CheckCircle2
              size={20}
            />

            <span>{success}</span>

          </div>
        )}

        {/* MAIN CARD */}

        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">

          {/* HEADER */}

          <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white lg:p-10">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div className="flex items-center gap-5">

                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/20">

                  <User size={42} />

                </div>

                <div>

                  <div className="flex items-center gap-3">

                    <h1 className="text-3xl font-bold">
                      {fullName}
                    </h1>

                    {profile.isVerified && (
                      <ShieldCheck
                        size={22}
                      />
                    )}

                  </div>

                  <p className="mt-2 text-violet-100">
                    MediConnect AI Patient
                  </p>

                  <p className="mt-1 text-sm text-violet-200">
                    {profile.email}
                  </p>

                </div>

              </div>

              {/* EDIT BUTTON */}

              {!editing ? (
                <button
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setEditing(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-violet-700 shadow-lg transition hover:bg-violet-50"
                >
                  <Pencil size={18} />

                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">

                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 font-semibold text-white hover:bg-white/25"
                  >
                    <X size={18} />

                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-violet-700 shadow-lg hover:bg-violet-50 disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={18} />
                    )}

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>
              )}

            </div>

          </div>

          {/* CONTENT */}

          <div className="p-8 lg:p-10">

            {/* PERSONAL INFORMATION */}

            <section>

              <div className="mb-6">

                <h2 className="text-xl font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your personal account information.
                </p>

              </div>

              {editing ? (
                <div className="grid gap-5 md:grid-cols-2">

                  <InputField
                    label="First Name"
                    value={
                      formData.firstName
                    }
                    onChange={(value) =>
                      updateField(
                        "firstName",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Last Name"
                    value={
                      formData.lastName
                    }
                    onChange={(value) =>
                      updateField(
                        "lastName",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Phone"
                    value={
                      formData.phone
                    }
                    onChange={(value) =>
                      updateField(
                        "phone",
                        value
                      )
                    }
                    type="tel"
                  />

                  <InputField
                    label="Date of Birth"
                    value={
                      formData.birthDate
                    }
                    onChange={(value) =>
                      updateField(
                        "birthDate",
                        value
                      )
                    }
                    type="date"
                  />

                  <SelectField
                    label="Gender"
                    value={
                      formData.gender
                    }
                    onChange={(value) =>
                      updateField(
                        "gender",
                        value
                      )
                    }
                    options={[
                      {
                        value: "",
                        label:
                          "Select gender",
                      },
                      {
                        value: "MALE",
                        label: "Male",
                      },
                      {
                        value: "FEMALE",
                        label: "Female",
                      },
                    ]}
                  />

                  <InputField
                    label="Preferred Language"
                    value={
                      formData.preferredLanguage
                    }
                    onChange={(value) =>
                      updateField(
                        "preferredLanguage",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Address"
                    value={
                      formData.address
                    }
                    onChange={(value) =>
                      updateField(
                        "address",
                        value
                      )
                    }
                  />

                  <InputField
                    label="City"
                    value={
                      formData.city
                    }
                    onChange={(value) =>
                      updateField(
                        "city",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Wilaya"
                    value={
                      formData.wilaya
                    }
                    onChange={(value) =>
                      updateField(
                        "wilaya",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Postal Code"
                    value={
                      formData.postalCode
                    }
                    onChange={(value) =>
                      updateField(
                        "postalCode",
                        value
                      )
                    }
                  />

                  {/* EMAIL READ ONLY */}

                  <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3">

                      <Mail
                        size={19}
                        className="text-slate-400"
                      />

                      <span className="text-slate-500">
                        {profile.email}
                      </span>

                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Email cannot be changed from this page.
                    </p>

                  </div>

                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                  <InfoCard
                    icon={<User size={20} />}
                    label="First Name"
                    value={
                      profile.firstName
                    }
                  />

                  <InfoCard
                    icon={<User size={20} />}
                    label="Last Name"
                    value={
                      profile.lastName
                    }
                  />

                  <InfoCard
                    icon={<Mail size={20} />}
                    label="Email"
                    value={
                      profile.email
                    }
                  />

                  <InfoCard
                    icon={<Phone size={20} />}
                    label="Phone"
                    value={
                      profile.phone ||
                      "Not provided"
                    }
                  />

                  <InfoCard
                    icon={
                      <CalendarDays
                        size={20}
                      />
                    }
                    label="Date of Birth"
                    value={
                      birthDate
                    }
                  />

                  <InfoCard
                    icon={
                      <VenusAndMars
                        size={20}
                      />
                    }
                    label="Gender"
                    value={
                      profile.gender ||
                      "Not provided"
                    }
                  />

                  <InfoCard
                    icon={
                      <MapPin size={20} />
                    }
                    label="Address"
                    value={
                      profile.address ||
                      "Not provided"
                    }
                  />

                  <InfoCard
                    icon={
                      <MapPin size={20} />
                    }
                    label="City"
                    value={
                      profile.city ||
                      "Not provided"
                    }
                  />

                  <InfoCard
                    icon={
                      <MapPin size={20} />
                    }
                    label="Wilaya"
                    value={
                      profile.wilaya ||
                      "Not provided"
                    }
                  />

                  <InfoCard
                    icon={
                      <ShieldCheck
                        size={20}
                      />
                    }
                    label="Account Status"
                    value={
                      profile.accountStatus
                    }
                    valueClassName="text-green-600"
                  />

                </div>
              )}

            </section>

            {/* HEALTH INFORMATION */}

            {patient && (
              <>
                <div className="my-10 h-px bg-slate-100" />

                <section>

                  <div className="mb-6">

                    <h2 className="text-xl font-bold text-slate-900">
                      Health Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Information related to your patient record.
                    </p>

                  </div>

                  <div className="grid gap-5 md:grid-cols-3">

                    <InfoCard
                      icon={
                        <HeartPulse
                          size={20}
                        />
                      }
                      label="Blood Type"
                      value={
                        patient.bloodType ||
                        "Not provided"
                      }
                    />

                    <InfoCard
                      icon={
                        <HeartPulse
                          size={20}
                        />
                      }
                      label="Allergies"
                      value={
                        patient.allergies ||
                        "None provided"
                      }
                    />

                    <InfoCard
                      icon={
                        <HeartPulse
                          size={20}
                        />
                      }
                      label="Chronic Conditions"
                      value={
                        patient.chronicConditions ||
                        "None provided"
                      }
                    />

                  </div>

                </section>
              </>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}

// ======================================================
// INFO CARD
// ======================================================

function InfoCard({
  icon,
  label,
  value,
  valueClassName = "text-slate-900",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 transition hover:bg-violet-50">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          {icon}
        </div>

        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

      </div>

      <p
        className={`mt-4 break-words text-base font-semibold ${valueClassName}`}
      >
        {value}
      </p>

    </div>
  );
}

// ======================================================
// INPUT FIELD
// ======================================================

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      />

    </div>
  );
}

// ======================================================
// SELECT FIELD
// ======================================================

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
      >

        {options.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          )
        )}

      </select>

    </div>
  );
}