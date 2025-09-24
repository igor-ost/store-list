import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { general, zippers = [], fabrics = [],user_id } = body;

    const order = await prisma.orders.create({
      data: {
        order_number: general.order_number,
        order_date: new Date(general.order_date),
        customer_name: general.customer_name,
        product_name: general.product_name,
        quantity: general.quantity,
        status: general.status,
        notes: general.notes,
        user_id: user_id,

        fabrics: {
          create: fabrics.map((f: any) => ({
            name: f.name,
            color: f.color,
            // consumption мапим в stock_meters
            stock_meters: Number(f.consumption) || 0,
            user_id: user_id,
          })),
        },

        zippers: {
          create: zippers.map((z: any) => ({
            type: z.type,
            color: z.color,

            stock_quantity: Number(z.quantity) || 0,
            user_id: user_id,
          })),
        },
      },
      include: {
        fabrics: true,
        zippers: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        fabrics: true,
        zippers: true,
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: {id:string},
) {
  try {
    const orderId = req.id


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