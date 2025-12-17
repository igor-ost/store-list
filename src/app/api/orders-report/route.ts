import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client"
import { getMemoryStats, logMemory } from "../../../../lib/memory-logger"

export async function GET(request: NextRequest) {
  const memBefore = getMemoryStats()
  logMemory("GET /api/orders-report - START")

  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get("month")
    const status = searchParams.get("status")
    const clientName = searchParams.get("clientName")
    const orderId = searchParams.get("orderId")

    const orders = await prisma.orders.findMany({
      where: {
        ...(month && {
          created_at: {
            gte: new Date(`${month}-01`),
            lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)),
          },
        }),
        ...(clientName && { customer: { name: { contains: clientName, mode: "insensitive" } } }),
        ...(orderId && { id: orderId }),
      },
      include: {
        customer: true,
        workLogs: {
          include: {
            worker: true,
          },
        },
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

    const detailedOrders = orders.map((order) => {
      let totalSewing = 0
      let totalCutting = 0
      let totalButtons = 0

      order.workLogs.forEach((log) => {
        if (log.workType === "sewing") {
          totalSewing += log.quantity
        } else if (log.workType === "cutting") {
          totalCutting += log.quantity
        } else if (log.workType === "buttons") {
          totalButtons += log.quantity
        }
      })

      const completedProducts = Math.min(totalSewing, totalCutting)
      const productionProgress = order.quantity > 0 ? (completedProducts / order.quantity) * 100 : 0

      // Определение статуса заказа
      let orderStatus: "completed" | "in-progress" | "pending" | "overproduced" = "pending"
      if (totalSewing > order.quantity || totalCutting > order.quantity) {
        orderStatus = "overproduced"
      } else if (totalSewing === order.quantity && totalCutting === order.quantity) {
        orderStatus = "completed"
      } else if (totalSewing > 0 || totalCutting > 0) {
        orderStatus = "in-progress"
      }

      const totalCost = totalSewing * order.sewing_price + totalCutting * order.cutting_price

      return {
        id: order.id,
        orderNumber: order.order_number,
        productName: order.product_name,
        clientName: order.customer?.name || "Не указан",
        clientBin: order.customer?.bin,
        quantity: order.quantity,
        quantityButtons: order.quantity_buttons || 0,
        sewingPrice: order.sewing_price,
        cuttingPrice: order.cutting_price,
        totalSewing,
        totalCutting,
        totalButtons,
        completedProducts,
        status: orderStatus,
        createdAt: order.created_at.toISOString(),
        totalCost,
        productionProgress,
        zippers: order.orderZippers.map((oz) => ({
          id: oz.zipper.id,
          color: oz.zipper.color,
          type: oz.zipper.type,
          qty: oz.qty,
          price: oz.price,
        })),
        threads: order.orderThreads.map((ot) => ({
          id: ot.thread.id,
          color: ot.thread.color,
          type: ot.thread.type,
          qty: ot.qty,
          price: ot.price,
        })),
        buttons: order.orderButtons.map((ob) => ({
          id: ob.button.id,
          color: ob.button.color,
          type: ob.button.type,
          qty: ob.qty,
          price: ob.price,
        })),
        fabrics: order.orderFabrics.map((of) => ({
          id: of.fabric.id,
          type: of.fabric.type,
          name: of.fabric.name,
          color: of.fabric.color,
          qty: of.qty,
          price: of.price,
        })),
        accessories: order.orderAccessories.map((oa) => ({
          id: oa.accessory.id,
          name: oa.accessory.name,
          qty: oa.qty,
          price: oa.price,
        })),
        velcro: order.orderVelcro.map((ov) => ({
          id: ov.velcro.id,
          name: ov.velcro.name,
          qty: ov.qty,
          price: ov.price,
        })),
        workLogs: order.workLogs.map((log) => ({
          id: log.id,
          workType: log.workType,
          quantity: log.quantity,
          createdAt: log.createdAt.toISOString(),
          workerName: log.worker?.name || "Неизвестный",
        })),
      }
    })

    // Фильтрация по статусу если указан
    const filteredOrders = status ? detailedOrders.filter((order) => order.status === status) : detailedOrders

    return NextResponse.json(filteredOrders)
  } catch (error) {
    console.error("Error fetching full order report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    logMemory("GET /api/orders-report - END", memBefore)

    if (global.gc) {
      global.gc()
      console.log("[v0] Garbage collection triggered after orders report")
    }
  }
}
