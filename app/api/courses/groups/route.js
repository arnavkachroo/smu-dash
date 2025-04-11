import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions.js";

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return Response.json({ error: "Missing courseId" }, { status: 400 });
  }

  try {
    const groups = await prisma.groups.findMany({
      where: { Course_ID: parseInt(courseId) },
      select: {
        Group_ID: true,
        GroupName: true,
      },
    });

    return Response.json(groups, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch groups:", error);
    return Response.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}
