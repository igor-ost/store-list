import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client";


interface DetailedWorkLog {
  id: string
  orderId: string
  orderNumber: string
  productName: string
  workerId: string
  workerName: string
  workType: "sewing" | "cutting"
  quantity: number
  pricePerUnit: number
  totalPrice: number
  createdAt: string
}

export async function GET(request: NextRequest) {
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

    const detailedLogs: DetailedWorkLog[] = workLogs.map((log) => {
      const pricePerUnit = log.workType === "sewing" ? log.order.sewing_price : log.order.cutting_price
      const totalPrice = log.quantity * pricePerUnit

      return {
        id: log.id,
        orderId: log.orderId,
        orderNumber: log.order.order_number,
        productName: log.order.product_name,
        workerId: log.workerId,
        workerName: log.worker.name || "Unknown",
        workType: log.workType as "sewing" | "cutting",
        quantity: log.quantity,
        pricePerUnit,
        totalPrice,
        createdAt: log.createdAt.toISOString(),
      }
    })

    return NextResponse.json(detailedLogs)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
