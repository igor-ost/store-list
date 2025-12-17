import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client"
import { getMemoryStats, logMemory } from "../../../../lib/memory-logger"

export async function POST(request: NextRequest) {
  const memBefore = getMemoryStats()
  logMemory("POST /api/work-log - START")

  try {
    const body = await request.json()
    const { orderId, workerId, workType, quantity } = body

    const worklog = await prisma.workLog.create({
      data: {
        orderId,
        workerId,
        workType,
        quantity,
      },
      include: {
        order: {
          include: { customer: true },
        },
        worker: true,
      },
    })

    return NextResponse.json(worklog)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    logMemory("POST /api/work-log - END", memBefore)
  }
}

export async function GET(request: NextRequest) {
  const memBefore = getMemoryStats()
  logMemory("GET /api/work-log - START")

  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    const where = orderId ? { orderId } : undefined

    const workLogs = await prisma.workLog.findMany({
      where,
      include: {
        order: {
          include: { customer: true },
        },
        worker: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(workLogs)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    logMemory("GET /api/work-log - END", memBefore)
  }
}
