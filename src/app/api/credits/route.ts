import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("========== SESSION ==========");
    console.log(session);

    if (!session) {
      console.log("❌ NO SESSION");

      return NextResponse.json({
        credits: 0,
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        credits: true,
      },
    });

    console.log("========== USER ==========");
    console.log(user);

    return NextResponse.json({
      credits: user?.credits ?? 0,
    });
  } catch (error) {
    console.error("========== API ERROR ==========");
    console.error(error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      },
    );
  }
}