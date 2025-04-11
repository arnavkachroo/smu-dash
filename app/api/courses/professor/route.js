import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions.js";

const prisma = new PrismaClient();

// GET: Get all courses where the current professor is assigned
export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("🧾 SESSION:", session);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userid = session.user.id;
    console.log("👤 USER ID:", userid);

    const classes = await prisma.courses.findMany({
      where: {
        ProfessorID: userid,
      },
      select: {
        Course_ID: true,
        CourseName: true,
      },
    });

    console.log("📘 Professor's Courses:", classes);
    return Response.json(classes, { status: 200 });
  } catch (error) {
    console.error("❌ Query error:", error);
    return Response.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

// POST: Add a new course assigned to the current professor
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { courseName } = body;

    if (!courseName) {
      return Response.json({ error: "Missing course name" }, { status: 400 });
    }

    const course = await prisma.courses.create({
      data: {
        CourseName: courseName,
        CourseCode: null, // Optional — or generate a placeholder if needed
        ProfessorID: session.user.id,
      },
    });


    return Response.json({ message: "Course added", course }, { status: 201 });
  } catch (err) {
    console.error("❌ POST Error:", err);
    return Response.json({ error: "Failed to add course", details: err.message }, { status: 500 });
  }
}
