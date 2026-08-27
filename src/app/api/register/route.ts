import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RegisterBody = {
  authUserId: string;

  role: "patient" | "doctor" | "pharmacy" | "laboratory";

  firstName: string;
  lastName: string;

  email: string;

  birthDate: string;
  gender: "MALE" | "FEMALE" | "OTHER";

  phone: string;

  address?: string | null;
  city?: string | null;
  wilaya?: string | null;

  guardian?: {
    firstName: string;
    lastName: string;
    relation: string;
    email: string;
    phone: string;
  } | null;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody;

    /*
     * ==========================================
     * 1. BASIC VALIDATION
     * ==========================================
     */

    if (
      !body.authUserId ||
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.birthDate ||
      !body.gender ||
      !body.phone ||
      !body.role
    ) {
      return NextResponse.json(
        {
          error: "Missing required registration information.",
        },
        { status: 400 }
      );
    }

    /*
     * ==========================================
     * 2. MAP FRONTEND ROLE → PRISMA ENUM
     * ==========================================
     */

    const roleMap = {
      patient: "PATIENT",
      doctor: "DOCTOR",
      pharmacy: "PHARMACIST",
      laboratory: "LABORATORY_STAFF",
    } as const;

    const userType = roleMap[body.role];

    if (!userType) {
      return NextResponse.json(
        {
          error: "Invalid account type.",
        },
        { status: 400 }
      );
    }

    /*
     * ==========================================
     * 3. CHECK EXISTING PROFILE
     * ==========================================
     */

    const existingProfile = await prisma.profile.findFirst({
      where: {
        OR: [
          {
            authUserId: body.authUserId,
          },
          {
            email: body.email.toLowerCase(),
          },
        ],
      },
    });

    if (existingProfile) {
      return NextResponse.json(
        {
          error: "A profile already exists for this account.",
        },
        { status: 409 }
      );
    }

    /*
     * ==========================================
     * 4. CHECK MINOR
     * ==========================================
     */

    const birthDate = new Date(body.birthDate);

    if (Number.isNaN(birthDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid birth date.",
        },
        { status: 400 }
      );
    }

    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const month =
      today.getMonth() -
      birthDate.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    const isMinor = age < 18;

    /*
     * ==========================================
     * 5. GUARDIAN VALIDATION
     * ==========================================
     */

    if (isMinor) {
      if (
        !body.guardian ||
        !body.guardian.firstName ||
        !body.guardian.lastName ||
        !body.guardian.email ||
        !body.guardian.phone
      ) {
        return NextResponse.json(
          {
            error:
              "Guardian information is required for patients under 18.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * ==========================================
     * 6. CREATE PROFILE + ROLE
     *    IN ONE TRANSACTION
     * ==========================================
     */

    const result = await prisma.$transaction(
      async (tx) => {
        /*
         * -----------------------------
         * Create Profile
         * -----------------------------
         */

        const profile = await tx.profile.create({
          data: {
            authUserId: body.authUserId,

            userType,

            email: body.email
              .trim()
              .toLowerCase(),

            firstName: body.firstName.trim(),

            lastName: body.lastName.trim(),

            birthDate,

            gender: body.gender,

            phone: body.phone.trim(),

            address:
              body.address?.trim() || null,

            city:
              body.city?.trim() || null,

            wilaya:
              body.wilaya?.trim() || null,

            accountStatus: "ACTIVE",

            isVerified: false,
          },
        });

        /*
         * -----------------------------
         * PATIENT
         * -----------------------------
         */

        if (userType === "PATIENT") {
          const patient =
            await tx.patient.create({
              data: {
                profileId: profile.id,

                guardianFirstName:
                  body.guardian?.firstName ||
                  null,

                guardianLastName:
                  body.guardian?.lastName ||
                  null,

                guardianEmail:
                  body.guardian?.email ||
                  null,

                guardianPhone:
                  body.guardian?.phone ||
                  null,

                guardianRelation:
                  body.guardian?.relation ||
                  null,
              },
            });

          return {
            profile,
            patient,
          };
        }

        /*
         * -----------------------------
         * DOCTOR
         * -----------------------------
         */

        if (userType === "DOCTOR") {
          const licenseNumber =
            `PENDING-${profile.id}`;

          const doctor =
            await tx.doctor.create({
              data: {
                profileId: profile.id,

                licenseNumber,

                isAcceptingNewPatients:
                  true,
              },
            });

          return {
            profile,
            doctor,
          };
        }

        /*
         * -----------------------------
         * PHARMACIST
         * -----------------------------
         */

        if (userType === "PHARMACIST") {
          const pharmacist =
            await tx.pharmacist.create({
              data: {
                profileId: profile.id,
              },
            });

          return {
            profile,
            pharmacist,
          };
        }

        /*
         * -----------------------------
         * LABORATORY STAFF
         * -----------------------------
         */

        if (
          userType ===
          "LABORATORY_STAFF"
        ) {
          const laboratoryStaff =
            await tx.laboratoryStaff.create({
              data: {
                profileId: profile.id,
              },
            });

          return {
            profile,
            laboratoryStaff,
          };
        }

        throw new Error(
          "Unsupported user type."
        );
      }
    );

    /*
     * ==========================================
     * 7. SUCCESS RESPONSE
     * ==========================================
     */

    return NextResponse.json(
      {
        success: true,

        message:
          "Account and profile created successfully.",

        userType,

        profileId: result.profile.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "REGISTER API ERROR:",
      error
    );

    /*
     * Prisma unique constraint
     */

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "This email or account information already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while creating the account.",
      },
      { status: 500 }
    );
  }
}