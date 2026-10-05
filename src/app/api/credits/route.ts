import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          credits: 0,
        },
        {
          status: 401,
        },
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        credits: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          credits: 0,
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      credits: user.credits,
    });
  } catch (error) {
    console.error("Credits API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch credits",
      },
      {
        status: 500,
      },
    );
  }
}