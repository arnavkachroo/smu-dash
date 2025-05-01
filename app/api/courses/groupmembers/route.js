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
  const groupId = searchParams.get("groupId");

  try {
    if (courseId && groupId) {
      const students = await prisma.$queryRawUnsafe(`
        SELECT DISTINCT u.UserID, u.FirstName, u.LastName, u.Email
        FROM Users u
        INNER JOIN GroupMembers gm ON u.UserID = gm.Student_ID
        INNER JOIN Groups g ON gm.Group_ID = g.Group_ID
        WHERE g.Course_ID = ${parseInt(courseId)} AND g.Group_ID = ${parseInt(groupId)};
      `);
      return Response.json(students, { status: 200 });
    } else if (courseId) {
      const groups = await prisma.groups.findMany({
        where: {
          Course_ID: parseInt(courseId),
        },
        select: {
          Group_ID: true,
          GroupName: true,
        },
      });
      return Response.json(groups, { status: 200 });
    } else {
      // ✅ Filter by professor only
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
    const { FirstName, LastName, Email, groupId } = body;

    if (!FirstName?.trim() || !LastName?.trim() || !Email?.trim() || !groupId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const student = await prisma.users.create({
      data: {
        FirstName,
        LastName,
        Email,
        Role: "student",
      },
    });

    const groupAssignment = await prisma.groupMembers.create({
      data: {
        Student_ID: student.UserID,
        Group_ID: parseInt(groupId),
      },
    });

    return Response.json(
      {
        message: "Student created and assigned to group",
        student,
        groupAssignment,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ POST Error:", err);
    return Response.json({ error: "Failed to add student", details: err.message }, { status: 500 });
  }
}
