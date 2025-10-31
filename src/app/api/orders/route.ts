import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { general,user_id } = body;
    const order = await prisma.orders.create({
      data: {
        order_number: general.order_number,
        order_date: new Date(general.order_date),
        customer_id: general.customer_id,
        product_name: general.product_name,
        quantity: general.quantity,
        status: general.status,
        notes: general.notes,
        user_id: user_id,
        image_urls: general.image_urls,
        product_id: general.product_id
      }
      },
    );

    return NextResponse.json(order, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
  }
}


export async function GET(req:Request) {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        customer:true
      },
    });
    console.log(req)
    return NextResponse.json(orders, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
  }
}

