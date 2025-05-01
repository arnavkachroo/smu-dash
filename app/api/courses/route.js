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

  try {
    if (courseId) {
      // Get students in selected course
      const students = await prisma.$queryRawUnsafe(`
        SELECT DISTINCT u.UserID, u.FirstName, u.LastName, u.Email
        FROM Users u
        INNER JOIN GroupMembers gm ON u.UserID = gm.Student_ID
        INNER JOIN Groups g ON gm.Group_ID = g.Group_ID
        WHERE g.Course_ID = ${parseInt(courseId)};
      `);

      return Response.json(students, { status: 200 });
    } else {
      // Get all available classes for the user
      const userid = session.user.id;
      const query = `SELECT DISTINCT c.CourseName FROM Courses c
inner join Groups g on c.Course_ID = g.Course_ID
inner join GroupMembers gm on g.Group_ID = gm.Group_ID
inner join Users u on gm.Student_ID = u.UserID
WHERE u.userID = ${userid}
Order by c.CourseName ASC;`;
      const classes = await prisma.$queryRawUnsafe(query);

      return Response.json(classes, { status: 200 });
    }
  } catch (err) {
    console.error("❌ Error:", err);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { UserID, FirstName, LastName, Email } = body;

    if (!UserID || !FirstName || !LastName || !Email) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const student = await prisma.users.create({
      data: {
        UserID: parseInt(UserID),
        FirstName,
        LastName,
        Email,
        Role: "STUDENT", // if you use roles
      },
    });

    return Response.json({ message: "Student added", student }, { status: 201 });
  } catch (err) {
    console.error("❌ POST Error:", err);
    return Response.json({ error: "Failed to add student" }, { status: 500 });
  }
}
