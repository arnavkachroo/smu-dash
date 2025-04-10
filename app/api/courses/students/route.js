import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch students in a group
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return Response.json({ error: "Missing groupId" }, { status: 400 });
    }

    const members = await prisma.$queryRawUnsafe(`
      SELECT u.UserID, u.FirstName, u.LastName, u.Email
      FROM Users u
      INNER JOIN GroupMembers gm ON u.UserID = gm.Student_ID
      WHERE gm.Group_ID = ${parseInt(groupId)};
    `);

    return Response.json(members, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching group members:", err);
    return Response.json({ error: "Failed to fetch group members" }, { status: 500 });
  }
}

// POST: Add a student to a group
export async function POST(req) {
  try {
    const body = await req.json();
    const { studentId, groupId } = body;

    if (!studentId || !groupId) {
      return Response.json({ error: "Missing studentId or groupId" }, { status: 400 });
    }

    const newMember = await prisma.groupMembers.create({
      data: {
        Student_ID: parseInt(studentId),
        Group_ID: parseInt(groupId),
      },
    });

    return Response.json({ message: "Student added to group", member: newMember }, { status: 201 });
  } catch (err) {
    console.error("❌ Error adding student to group:", err);
    return Response.json({ error: "Failed to add student to group" }, { status: 500 });
  }
}
