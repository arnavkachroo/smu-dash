import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions.js";
const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const professorID = session.user.id;
    const query = `SELECT 
    c.CourseName
FROM 
    Courses c
JOIN 
    Users u ON c.ProfessorID = u.UserID
WHERE 
    u.Role = 'professor'
AND u.UserID =` + professorID + ";";
    const classes = await prisma.$queryRawUnsafe(query); 
    return Response.json(classes, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}



