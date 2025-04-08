import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(_req, { params }) {
  const { id } = params;

  try {
    await prisma.scheduledEvaluation.delete({
      where: { scheduled_eval_id: parseInt(id) },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to submit evaluation" }), { status: 500 });
  }
}
