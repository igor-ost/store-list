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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.orders.findUnique({
      where: {
        id: (params.id)
      },
      include: {
        fabrics: true,
        zippers: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: `Order with id ${params.id} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order", details: error.message },
      { status: 500 }
    )
  }
}
