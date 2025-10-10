import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }>}

) {
  try {
    const { id } = await context.params;

    await prisma.user.delete({
      where: { id: id },
    })
    console.log(req)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления персонала:", error)
    return NextResponse.json(
      { error: "Не удалось удалить персонала" },
      { status: 500 }
    )
  }
}