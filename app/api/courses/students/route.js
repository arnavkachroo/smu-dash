import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions.js";

const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "professor") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  try {
    if (courseId) {
      // ✅ Verify professor owns the course
      const course = await prisma.courses.findFirst({
        where: {
          Course_ID: parseInt(courseId),
          ProfessorID: session.user.id,
        },
      });

      if (!course) {
        return Response.json({ error: "Course not found or unauthorized" }, { status: 403 });
      }

      const students = await prisma.$queryRawUnsafe(`
        SELECT DISTINCT u.UserID, u.FirstName, u.LastName, u.Email
        FROM Users u
        INNER JOIN GroupMembers gm ON u.UserID = gm.Student_ID
        INNER JOIN Groups g ON gm.Group_ID = g.Group_ID
        WHERE g.Course_ID = ${parseInt(courseId)};
      `);

      return Response.json(students, { status: 200 });
    } else {
      // ✅ Only return courses taught by this professor
      const classes = await prisma.courses.findMany({
        where: {
          ProfessorID: session.user.id,
        },
        select: {
          Course_ID: true,
          CourseName: true,
        },
      });

      return Response.json(classes, { status: 200 });
    }
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    return Response.json({ error: "Failed to fetch data", details: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "professor") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { FirstName, LastName, Email, Course_ID } = body;

    if (!FirstName?.trim() || !LastName?.trim() || !Email?.trim() || !Course_ID) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Ensure the professor owns the course
    const course = await prisma.courses.findFirst({
      where: {
        Course_ID: parseInt(Course_ID),
        ProfessorID: session.user.id,
      },
    });

    if (!course) {
      return Response.json({ error: "Unauthorized to add student to this course" }, { status: 403 });
    }

    const student = await prisma.users.create({
      data: {
        FirstName,
        LastName,
        Email,
        Role: "student",
      },
    });

    return Response.json(
      {
        message: "Student created",
        student,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ POST Error:", err);
    return Response.json({ error: "Failed to add student", details: err.message }, { status: 500 });
  }
}
