import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(
  req: {id:string},
  { params }: { params: { id: string } }
) {
  try {
    const customerId = await params.id

    await prisma.customer.delete({
      where: { id: customerId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления Заказчика:", error)
    return NextResponse.json(
      { error: "Не удалось удалить Заказчика" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: (params.id)
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: `customer with id ${params.id} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(customer, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching customer:", error)
    return NextResponse.json(
      { error: "Failed to fetch customer", details: error.message },
      { status: 500 }
    )
  }
}
