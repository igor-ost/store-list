import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";



export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const customer = await prisma.customer.create({
      data: body,
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Заказчик с таким БИН уже существует" }, { status: 409 })
    }

    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Не удалось создать заказчика" }, { status: 500 })
  }
}
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(customers, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers", details: error.message },
      { status: 500 }
    );
  }
}
