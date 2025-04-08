import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
const prisma = new PrismaClient();

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userid = session.user.id;
    const query = `SELECT DISTINCT c.CourseName FROM Courses c 
    inner join Groups g on c.Course_ID = g.Course_ID 
    inner join GroupMembers gm on g.Group_ID = gm.Group_ID 
    inner join Users u on u.UserID = gm.Student_ID 
    WHERE u.userID = ` + userid + ";";
    const classes = await prisma.$queryRawUnsafe(query); // Adjust model name as per schema
    return Response.json(classes, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}
const handler = NextAuth(authOptions);

