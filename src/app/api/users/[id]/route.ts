import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(
  req: {id:string,order_number:string},
  { params }: { params: { id: string } }
) {
  try {
    const workerId = params.id

    await prisma.user.delete({
      where: { id: workerId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления персонала:", error)
    return NextResponse.json(
      { error: "Не удалось удалить персонала" },
      { status: 500 }
    )
  }
}