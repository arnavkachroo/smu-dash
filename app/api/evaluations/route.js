import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions.js";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if(session.user.role == "student") {
  try {
    const userid = session.user.id;
    const query = `SELECT DISTINCT se.scheduled_eval_id, c.Course_ID, c.CourseName, DATE(se.ScheduledDate_Due) AS DueDate FROM ScheduledEvaluation se
INNER JOIN Courses c on se.Course_ID = c.Course_ID
inner join Groups g on c.Course_ID = g.Course_ID
inner join GroupMembers gm on g.group_id = gm.group_id
inner join Users u on u.userID = gm.Student_id
WHERE u.userID = ${userid}
Order by DueDate;`;
    const evaluations = await prisma.$queryRawUnsafe(query); // Adjust model name as per schema
    return Response.json(evaluations, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to fetch evaluations" }, { status: 500 });
  }
}
  else if(session.user.role == "professor") {
    try {
      const userid = session.user.id;
      const query = `SELECT DISTINCT se.scheduled_eval_id, c.Course_ID, c.CourseName, DATE(se.ScheduledDate_Due) AS DueDate FROM ScheduledEvaluation se
INNER JOIN Courses c on se.Course_ID = c.Course_ID
inner join Groups g on c.Course_ID = g.Course_ID
inner join Users u on u.userID = c.ProfessorID
WHERE u.userID = ${userid}
Order by DueDate;`;
      const evaluations = await prisma.$queryRawUnsafe(query); // Adjust model name as per schema
      return Response.json(evaluations, { status: 200 });
    } catch (error) {
      console.log(error);
      return Response.json({ error: "Failed to fetch evaluations" }, { status: 500 });
    }
}}
