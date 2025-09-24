import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(
  req: {id:string,order_number:string},
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id


    await prisma.zippers.deleteMany({
      where: { order_id:orderId },
    })

    await prisma.fabrics.deleteMany({
      where: { order_id:orderId },
    })


    await prisma.orders.delete({
      where: { id: orderId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления заказа:", error)
    return NextResponse.json(
      { error: "Не удалось удалить заказ" },
      { status: 500 }
    )
  }
}