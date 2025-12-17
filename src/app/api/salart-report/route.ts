import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client"
import { getMemoryStats, logMemory } from "../../../../lib/memory-logger"

interface DetailedWorkLog {
  id: string
  orderId: string
  orderNumber: string
  productName: string
  workerId: string
  workerName: string
  workType: "sewing" | "cutting" | "buttons"
  quantity: number
  pricePerUnit: number
  totalPrice: number
  createdAt: string
  requiredProducts: number
  requiredButtons: number
  totalSewing: number
  totalCutting: number
  totalButtons: number
}

export async function GET(request: NextRequest) {
  const memBefore = getMemoryStats()
  logMemory("GET /api/salart-report - START")

  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get("month")
    const workerId = searchParams.get("workerId")

    const workLogs = await prisma.workLog.findMany({
      where: {
        ...(workerId && { workerId }),
        ...(month && {
          createdAt: {
            gte: new Date(`${month}-01`),
            lt: new Date(new Date(`${month}-01`).setMonth(new Date(`${month}-01`).getMonth() + 1)),
          },
        }),
      },
      include: {
        worker: true,
        order: true,
      },
      orderBy: [{ createdAt: "desc" }],
    })

    const orderStatsMap = new Map<
      string,
      {
        totalSewing: number
        totalCutting: number
        totalButtons: number
      }
    >()

    // First pass: calculate totals per order
    workLogs.forEach((log) => {
      if (!orderStatsMap.has(log.orderId)) {
        orderStatsMap.set(log.orderId, {
          totalSewing: 0,
          totalCutting: 0,
          totalButtons: 0,
        })
      }
      const stats = orderStatsMap.get(log.orderId)!

      if (log.workType === "sewing") {
        stats.totalSewing += log.quantity
      } else if (log.workType === "cutting") {
        stats.totalCutting += log.quantity
      } else if (log.workType === "buttons") {
        stats.totalButtons += log.quantity
      }
    })

    const detailedLogs: DetailedWorkLog[] = workLogs.map((log) => {
      let pricePerUnit = 0
      if (log.workType === "sewing") {
        pricePerUnit = log.order.sewing_price
      } else if (log.workType === "cutting") {
        pricePerUnit = log.order.cutting_price
      }
      // For buttons, pricePerUnit remains 0

      const totalPrice = log.quantity * pricePerUnit

      const orderStats = orderStatsMap.get(log.orderId) || {
        totalSewing: 0,
        totalCutting: 0,
        totalButtons: 0,
      }

      return {
        id: log.id,
        orderId: log.orderId,
        orderNumber: log.order.order_number,
        productName: log.order.product_name,
        workerId: log.workerId,
        workerName: log.worker.name || "Unknown",
        workType: log.workType as "sewing" | "cutting" | "buttons",
        quantity: log.quantity,
        pricePerUnit,
        totalPrice,
        createdAt: log.createdAt.toISOString(),
        requiredProducts: log.order.quantity || 0,
        requiredButtons: log.order.quantity_buttons || 0,
        totalSewing: orderStats.totalSewing,
        totalCutting: orderStats.totalCutting,
        totalButtons: orderStats.totalButtons,
      }
    })

    return NextResponse.json(detailedLogs)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    logMemory("GET /api/salart-report - END", memBefore)
  }
}
