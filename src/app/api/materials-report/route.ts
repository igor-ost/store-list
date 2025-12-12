import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get("month")

    const orders = await prisma.orders.findMany({
      where: {
        ...(month && {
          created_at: {
            gte: new Date(`${month}-01`),
            lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)),
          },
        }),
      },
      include: {
        customer: true,
        orderZippers: {
          include: {
            zipper: true,
          },
        },
        orderThreads: {
          include: {
            thread: true,
          },
        },
        orderButtons: {
          include: {
            button: true,
          },
        },
        orderFabrics: {
          include: {
            fabric: true,
          },
        },
        orderAccessories: {
          include: {
            accessory: true,
          },
        },
        orderVelcro: {
          include: {
            velcro: true,
          },
        },
      },
      orderBy: [{ created_at: "desc" }],
    })

    const materialsReport = orders.map((order) => {
      const zippersTotal = order.orderZippers.reduce((sum, oz) => sum + (oz.price || 0) * oz.qty, 0)
      const threadsTotal = order.orderThreads.reduce((sum, ot) => sum + (ot.price || 0) * ot.qty, 0)
      const buttonsTotal = order.orderButtons.reduce((sum, ob) => sum + (ob.price || 0) * ob.qty, 0)
      const fabricsTotal = order.orderFabrics.reduce((sum, of) => sum + (of.price || 0) * of.qty, 0)
      const accessoriesTotal = order.orderAccessories.reduce((sum, oa) => sum + (oa.price || 0) * oa.qty, 0)
      const velcroTotal = order.orderVelcro.reduce((sum, ov) => sum + (ov.price || 0) * ov.qty, 0)

      const totalMaterialsCost =
        zippersTotal + threadsTotal + buttonsTotal + fabricsTotal + accessoriesTotal + velcroTotal

      return {
        orderNumber: order.order_number,
        orderDate: order.created_at.toISOString(),
        productName: order.product_name,
        clientName: order.customer?.name || "Не указан",
        zippers: zippersTotal,
        threads: threadsTotal,
        buttons: buttonsTotal,
        fabrics: fabricsTotal,
        accessories: accessoriesTotal,
        velcro: velcroTotal,
        totalMaterialsCost,
      }
    })

    return NextResponse.json(materialsReport)
  } catch (error) {
    console.error("Error fetching materials report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
