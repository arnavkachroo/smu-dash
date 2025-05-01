import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions.js";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "professor") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await prisma.courses.findMany({
      where: { ProfessorID: session.user.id },
      select: {
        Course_ID: true,
        CourseName: true,
      },
    });

    return Response.json(courses, { status: 200 });
  } catch (err) {
    console.error("❌ GET Error:", err);
    return Response.json({ error: "Failed to fetch courses", details: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "professor") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { Course_ID, ScheduledDate_Due } = await req.json();

    const newEvaluation = await prisma.scheduledEvaluation.create({
      data: {
        Course_ID,
        ScheduledDate_Due: new Date(ScheduledDate_Due),
      },
    });

    return Response.json({ message: "Evaluation created", evaluation: newEvaluation }, { status: 201 });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return Response.json({ error: "Failed to create evaluation", details: error.message }, { status: 500 });
  }
}
