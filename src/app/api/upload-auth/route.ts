import { getUploadAuthParams } from "@imagekit/next/server";
import { headers } from "next/headers";

import { env } from "~/env";
import { auth } from "~/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { token, expire, signature } = getUploadAuthParams({
      privateKey: env.IMAGEKIT_PRIVATE_KEY,
      publicKey: env.IMAGEKIT_PUBLIC_KEY,
    });

    return Response.json({
      token,
      expire,
      signature,
      publicKey: env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
    });
  } catch (error) {
    console.error("Upload auth error:", error);

    return Response.json(
      { error: "Failed to generate upload credentials" },
      { status: 500 },
    );
  }
}