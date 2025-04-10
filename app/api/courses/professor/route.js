import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions.js";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  console.log("🧾 SESSION:", session);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userid = session.user.id;
    console.log("👤 USER ID:", userid);

    const query = `SELECT DISTINCT c.CourseName FROM Courses c 
      INNER JOIN Groups g ON c.Course_ID = g.Course_ID 
      INNER JOIN GroupMembers gm ON g.Group_ID = gm.Group_ID 
      INNER JOIN Users u ON u.UserID = gm.Student_ID 
      WHERE u.userID = ${userid};`;

    const classes = await prisma.$queryRawUnsafe(query);
    console.log("📘 Classes found:", classes);

    return Response.json(classes, { status: 200 });
  } catch (error) {
    console.error("❌ Query error:", error);
    return Response.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { studentName, studentEmail } = body;

    if (!studentName || !studentEmail) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const newStudent = await prisma.users.create({
      data: {
        Name: studentName,
        Email: studentEmail,
        Role: "STUDENT",
      },
    });

    return Response.json({ message: "Student added", student: newStudent }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to add student:", error);
    return Response.json({ error: "Failed to add student" }, { status: 500 });
  }
}
