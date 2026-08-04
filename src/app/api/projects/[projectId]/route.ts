import { headers } from "next/headers";
import ImageKit from "imagekit";
import { auth } from "~/lib/auth";
import { env } from "~/env";
import { db } from "~/server/db";


const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (project.userId !== session.user.id) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (project.ImageKitId) {
    await imagekit.deleteFile(project.ImageKitId);
  }

  await db.project.delete({
    where: {
      id: projectId,
    },
  });

  return Response.json({ success: true });
}