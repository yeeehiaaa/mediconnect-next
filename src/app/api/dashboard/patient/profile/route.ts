import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

/* ============================================================
   SUPABASE AUTH CLIENT
   Used ONLY to verify the user's access token.
============================================================ */

function getSupabaseAuthClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase public environment variables are missing."
    );
  }

  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/* ============================================================
   SUPABASE ADMIN CLIENT
   Used ONLY on the server to update Auth metadata.
============================================================ */

function getSupabaseAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is missing."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/* ============================================================
   AUTHENTICATED USER
============================================================ */

async function getAuthenticatedUser(
  request: NextRequest
) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization) {
    return null;
  }

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const token =
    authorization
      .substring(7)
      .trim();

  if (!token) {
    return null;
  }

  try {
    const supabase =
      getSupabaseAuthClient();

    const {
      data: { user },
      error,
    } =
      await supabase.auth.getUser(token);

    if (error || !user) {
      console.error(
        "SUPABASE AUTH ERROR:",
        error
      );

      return null;
    }

    return user;
  } catch (error) {
    console.error(
      "AUTHENTICATION ERROR:",
      error
    );

    return null;
  }
}

/* ============================================================
   GET PATIENT PROFILE
============================================================ */

export async function GET(
  request: NextRequest
) {
  try {
    /* --------------------------------------------------------
       1. AUTHENTICATION
    -------------------------------------------------------- */

    const user =
      await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated.",
        },
        {
          status: 401,
        }
      );
    }

    /* --------------------------------------------------------
       2. FIND PROFILE
    -------------------------------------------------------- */

    const profile =
      await prisma.profile.findUnique({
        where: {
          authUserId: user.id,
        },

        select: {
          id: true,
          authUserId: true,
          userType: true,

          email: true,
          firstName: true,
          lastName: true,

          phone: true,
          birthDate: true,
          gender: true,

          address: true,
          city: true,
          wilaya: true,
          postalCode: true,

          preferredLanguage: true,

          accountStatus: true,
          isVerified: true,

          patient: {
            select: {
              id: true,

              bloodType: true,

              allergies: true,
              chronicConditions: true,

              emergencyContactName: true,
              emergencyContactPhone: true,
              emergencyContactRelation: true,

              guardianFirstName: true,
              guardianLastName: true,
              guardianEmail: true,
              guardianPhone: true,
              guardianRelation: true,
            },
          },
        },
      });

    /* --------------------------------------------------------
       3. PROFILE NOT FOUND
    -------------------------------------------------------- */

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: "Profile not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* --------------------------------------------------------
       4. CHECK PATIENT
    -------------------------------------------------------- */

    if (profile.userType !== "PATIENT") {
      return NextResponse.json(
        {
          success: false,
          error:
            "This profile is only available for patients.",
        },
        {
          status: 403,
        }
      );
    }

    /* --------------------------------------------------------
       5. CHECK PATIENT RECORD
    -------------------------------------------------------- */

    if (!profile.patient) {
      return NextResponse.json(
        {
          success: false,
          error: "Patient record not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* --------------------------------------------------------
       6. DISPLAY NAME
    -------------------------------------------------------- */

    const displayName =
      user.user_metadata?.display_name ||
      `${profile.firstName} ${profile.lastName}`;

    /* --------------------------------------------------------
       7. RESPONSE
    -------------------------------------------------------- */

    return NextResponse.json(
      {
        success: true,

        user: {
          id: user.id,

          email:
            user.email ??
            profile.email,

          displayName,

          firstName:
            user.user_metadata?.first_name ??
            profile.firstName,

          lastName:
            user.user_metadata?.last_name ??
            profile.lastName,
        },

        profile,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET PATIENT PROFILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to retrieve patient profile.",
      },
      {
        status: 500,
      }
    );
  }
}

/* ============================================================
   PUT PATIENT PROFILE
============================================================ */

export async function PUT(
  request: NextRequest
) {
  try {
    /* --------------------------------------------------------
       1. AUTHENTICATION
    -------------------------------------------------------- */

    const user =
      await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated.",
        },
        {
          status: 401,
        }
      );
    }

    /* --------------------------------------------------------
       2. READ BODY
    -------------------------------------------------------- */

    const body =
      await request.json();

    const {
      firstName,
      lastName,
      phone,
      birthDate,
      gender,
      address,
      city,
      wilaya,
      postalCode,
      preferredLanguage,
    } = body;

    /* --------------------------------------------------------
       3. VALIDATE FIRST NAME
    -------------------------------------------------------- */

    if (
      typeof firstName !== "string" ||
      !firstName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "First name is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* --------------------------------------------------------
       4. VALIDATE LAST NAME
    -------------------------------------------------------- */

    if (
      typeof lastName !== "string" ||
      !lastName.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Last name is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* --------------------------------------------------------
       5. FIND EXISTING PROFILE
    -------------------------------------------------------- */

    const existingProfile =
      await prisma.profile.findUnique({
        where: {
          authUserId: user.id,
        },

        select: {
          id: true,
          userType: true,
          email: true,
        },
      });

    if (!existingProfile) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Profile not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* --------------------------------------------------------
       6. CHECK USER TYPE
    -------------------------------------------------------- */

    if (
      existingProfile.userType !==
      "PATIENT"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This profile belongs to a non-patient account.",
        },
        {
          status: 403,
        }
      );
    }

    /* --------------------------------------------------------
       7. CHECK PATIENT RECORD
    -------------------------------------------------------- */

    const patient =
      await prisma.patient.findUnique({
        where: {
          profileId:
            existingProfile.id,
        },

        select: {
          id: true,
        },
      });

    if (!patient) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Patient record not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* --------------------------------------------------------
       8. VALIDATE GENDER
    -------------------------------------------------------- */

    let validGender:
      | "MALE"
      | "FEMALE"
      | null
      | undefined;

    if (gender === "MALE") {
      validGender = "MALE";
    } else if (
      gender === "FEMALE"
    ) {
      validGender = "FEMALE";
    } else if (
      gender === null ||
      gender === ""
    ) {
      validGender = null;
    } else {
      validGender = undefined;
    }

    /* --------------------------------------------------------
       9. VALIDATE BIRTH DATE
    -------------------------------------------------------- */

    let validBirthDate:
      | Date
      | null
      | undefined;

    if (
      typeof birthDate === "string" &&
      birthDate.trim()
    ) {
      const parsedDate =
        new Date(birthDate);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid birth date.",
          },
          {
            status: 400,
          }
        );
      }

      validBirthDate =
        parsedDate;
    } else if (
      birthDate === null ||
      birthDate === ""
    ) {
      validBirthDate = null;
    }

    /* --------------------------------------------------------
       10. PREPARE PRISMA DATA
    -------------------------------------------------------- */

    const profileUpdateData: {
      firstName: string;
      lastName: string;
      phone?: string | null;
      birthDate?: Date | null;
      gender?:
        | "MALE"
        | "FEMALE"
        | null;
      address?: string | null;
      city?: string | null;
      wilaya?: string | null;
      postalCode?: string | null;
      preferredLanguage?: string;
    } = {
      firstName:
        firstName.trim(),

      lastName:
        lastName.trim(),
    };

    /* --------------------------------------------------------
       PHONE
    -------------------------------------------------------- */

    if (
      typeof phone === "string"
    ) {
      profileUpdateData.phone =
        phone.trim()
          ? phone.trim()
          : null;
    }

    /* --------------------------------------------------------
       BIRTH DATE
    -------------------------------------------------------- */

    if (
      validBirthDate !==
      undefined
    ) {
      profileUpdateData.birthDate =
        validBirthDate;
    }

    /* --------------------------------------------------------
       GENDER
    -------------------------------------------------------- */

    if (
      validGender !== undefined
    ) {
      profileUpdateData.gender =
        validGender;
    }

    /* --------------------------------------------------------
       ADDRESS
    -------------------------------------------------------- */

    if (
      typeof address === "string"
    ) {
      profileUpdateData.address =
        address.trim()
          ? address.trim()
          : null;
    }

    /* --------------------------------------------------------
       CITY
    -------------------------------------------------------- */

    if (
      typeof city === "string"
    ) {
      profileUpdateData.city =
        city.trim()
          ? city.trim()
          : null;
    }

    /* --------------------------------------------------------
       WILAYA
    -------------------------------------------------------- */

    if (
      typeof wilaya === "string"
    ) {
      profileUpdateData.wilaya =
        wilaya.trim()
          ? wilaya.trim()
          : null;
    }

    /* --------------------------------------------------------
       POSTAL CODE
    -------------------------------------------------------- */

    if (
      typeof postalCode ===
      "string"
    ) {
      profileUpdateData.postalCode =
        postalCode.trim()
          ? postalCode.trim()
          : null;
    }

    /* --------------------------------------------------------
       LANGUAGE
    -------------------------------------------------------- */

    if (
      typeof preferredLanguage ===
        "string" &&
      preferredLanguage.trim()
    ) {
      profileUpdateData.preferredLanguage =
        preferredLanguage.trim();
    }

    /* --------------------------------------------------------
       11. UPDATE PRISMA
    -------------------------------------------------------- */

    const updatedProfile =
      await prisma.profile.update({
        where: {
          authUserId: user.id,
        },

        data:
          profileUpdateData,

        select: {
          id: true,
          authUserId: true,
          userType: true,

          email: true,
          firstName: true,
          lastName: true,

          phone: true,
          birthDate: true,
          gender: true,

          address: true,
          city: true,
          wilaya: true,
          postalCode: true,

          preferredLanguage: true,

          accountStatus: true,
          isVerified: true,

          patient: {
            select: {
              id: true,

              bloodType: true,
              allergies: true,
              chronicConditions:
                true,

              emergencyContactName:
                true,
              emergencyContactPhone:
                true,
              emergencyContactRelation:
                true,

              guardianFirstName:
                true,
              guardianLastName:
                true,
              guardianEmail:
                true,
              guardianPhone:
                true,
              guardianRelation:
                true,
            },
          },
        },
      });

    /* --------------------------------------------------------
       12. CREATE DISPLAY NAME
    -------------------------------------------------------- */

    const displayName =
      `${firstName.trim()} ${lastName.trim()}`;

    /* --------------------------------------------------------
       13. UPDATE SUPABASE AUTH METADATA
    -------------------------------------------------------- */

    const supabaseAdmin =
      getSupabaseAdminClient();

    const {
      data: authData,
      error:
        authUpdateError,
    } =
      await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          user_metadata: {
            ...(user.user_metadata ||
              {}),

            display_name:
              displayName,

            first_name:
              firstName.trim(),

            last_name:
              lastName.trim(),
          },
        }
      );

    /* --------------------------------------------------------
       14. SUPABASE UPDATE ERROR
    -------------------------------------------------------- */

    if (authUpdateError) {
      console.error(
        "SUPABASE AUTH UPDATE ERROR:",
        authUpdateError
      );

      return NextResponse.json(
        {
          success: false,

          error:
            "Profile updated in the database, but the Supabase account information could not be synchronized.",

          profile:
            updatedProfile,

          user: {
            id: user.id,

            email:
              user.email ??
              updatedProfile.email,

            displayName,

            firstName:
              firstName.trim(),

            lastName:
              lastName.trim(),
          },
        },
        {
          status: 500,
        }
      );
    }

    /* --------------------------------------------------------
       15. SUCCESS
    -------------------------------------------------------- */

    return NextResponse.json(
      {
        success: true,

        message:
          "Patient profile updated successfully.",

        profile:
          updatedProfile,

        user: {
          id:
            authData.user?.id ??
            user.id,

          email:
            authData.user?.email ??
            user.email ??
            updatedProfile.email,

          displayName:
            authData.user
              ?.user_metadata
              ?.display_name ??
            displayName,

          firstName:
            authData.user
              ?.user_metadata
              ?.first_name ??
            firstName.trim(),

          lastName:
            authData.user
              ?.user_metadata
              ?.last_name ??
            lastName.trim(),
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "UPDATE PATIENT PROFILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Unable to update patient profile.",
      },
      {
        status: 500,
      }
    );
  }
}