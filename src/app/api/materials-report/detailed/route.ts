import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../../prisma/prisma-client"
import { getMemoryStats, logMemory } from "../../../../../lib/memory-logger"

export interface MaterialsReport {
  orderNumber: string
  orderDate: string
  productName: string
  clientName: string
  zippers: number
  threads: number
  buttons: number
  fabrics: number
  accessories: number
  velcro: number
  totalMaterialsCost: number
}

export interface MaterialsSummary {
  totalOrders: number
  totalCost: number
  materialBreakdown: {
    zippers: { count: number; cost: number }
    threads: { count: number; cost: number }
    buttons: { count: number; cost: number }
    fabrics: { count: number; cost: number }
    accessories: { count: number; cost: number }
    velcro: { count: number; cost: number }
  }
}

export interface MaterialDetail {
  materialId: string
  materialName: string
  materialType: "zipper" | "thread" | "button" | "fabric" | "accessory" | "velcro"
  color?: string
  unit: string
  quantity: number
  pricePerUnit: number
  totalCost: number
  orderNumber: string
  orderDate: string
  productName: string
  clientName: string
}

export interface DetailedMaterialsReport {
  materials: MaterialDetail[]
  summary: {
    totalCost: number
    totalItems: number
    byType: {
      zippers: { quantity: number; cost: number; count: number }
      threads: { quantity: number; cost: number; count: number }
      buttons: { quantity: number; cost: number; count: number }
      fabrics: { quantity: number; cost: number; count: number }
      accessories: { quantity: number; cost: number; count: number }
      velcro: { quantity: number; cost: number; count: number }
    }
  }
}

export async function GET(request: NextRequest) {
  const memBefore = getMemoryStats()
  logMemory("GET /api/materials-report/detailed - START")

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

    const materials: MaterialDetail[] = []

    orders.forEach((order) => {
      // Молнии
      order.orderZippers.forEach((oz) => {
        materials.push({
          materialId: oz.zipper.id,
          materialName: `${oz.zipper.type} - ${oz.zipper.color}`,
          materialType: "zipper",
          color: oz.zipper.color,
          unit: oz.zipper.unit,
          quantity: oz.qty,
          pricePerUnit: oz.price || 0,
          totalCost: (oz.price || 0) * oz.qty,
          orderNumber: order.order_number,
          orderDate: order.created_at.toISOString(),
          productName: order.product_name,
          clientName: order.customer?.name || "Не указан",
        })
      })

      // Нитки
      order.orderThreads.forEach((ot) => {
        materials.push({
          materialId: ot.thread.id,
          materialName: `${ot.thread.type} - ${ot.thread.color}`,
          materialType: "thread",
          color: ot.thread.color,
          unit: ot.thread.unit,
          quantity: ot.qty,
          pricePerUnit: ot.price || 0,
          totalCost: (ot.price || 0) * ot.qty,
          orderNumber: order.order_number,
          orderDate: order.created_at.toISOString(),
          productName: order.product_name,
          clientName: order.customer?.name || "Не указан",
        })
      })

      // Пуговицы
      order.orderButtons.forEach((ob) => {
        materials.push({
          materialId: ob.button.id,
          materialName: `${ob.button.type} - ${ob.button.color}`,
          materialType: "button",
          color: ob.button.color,
          unit: ob.button.unit,
          quantity: ob.qty,
          pricePerUnit: ob.price || 0,
          totalCost: (ob.price || 0) * ob.qty,
          orderNumber: order.order_number,
          orderDate: order.created_at.toISOString(),
          productName: order.product_name,
          clientName: order.customer?.name || "Не указан",
        })
      })

      // Ткани
      order.orderFabrics.forEach((of) => {
        materials.push({
          materialId: of.fabric.id,
          materialName: `${of.fabric.name} - ${of.fabric.type}${of.fabric.color ? ` - ${of.fabric.color}` : ""}`,
          materialType: "fabric",
          color: of.fabric.color || undefined,
          unit: of.fabric.unit,
          quantity: of.qty,
          pricePerUnit: of.price || 0,
          totalCost: (of.price || 0) * of.qty,
          orderNumber: order.order_number,
          orderDate: order.created_at.toISOString(),
          productName: order.product_name,
          clientName: order.customer?.name || "Не указан",
        })
      })

      // Аксессуары
      order.orderAccessories.forEach((oa) => {
        materials.push({
          materialId: oa.accessory.id,
          materialName: oa.accessory.name,
          materialType: "accessory",
          unit: oa.accessory.unit,
          quantity: oa.qty,
          pricePerUnit: oa.price || 0,
          totalCost: (oa.price || 0) * oa.qty,
          orderNumber: order.order_number,
          orderDate: order.created_at.toISOString(),
          productName: order.product_name,
          clientName: order.customer?.name || "Не указан",
        })
      })

      // Липучки
      order.orderVelcro.forEach((ov) => {
        materials.push({
          materialId: ov.velcro.id,
          materialName: ov.velcro.name,
          materialType: "velcro",
          unit: ov.velcro.unit,
          quantity: ov.qty,
          pricePerUnit: ov.price || 0,
          totalCost: (ov.price || 0) * ov.qty,
          orderNumber: order.order_number,
          orderDate: order.created_at.toISOString(),
          productName: order.product_name,
          clientName: order.customer?.name || "Не указан",
        })
      })
    })

    // Подсчет итогов
    const summary = {
      totalCost: materials.reduce((sum, m) => sum + m.totalCost, 0),
      totalItems: materials.length,
      byType: {
        zippers: {
          quantity: materials.filter((m) => m.materialType === "zipper").reduce((sum, m) => sum + m.quantity, 0),
          cost: materials.filter((m) => m.materialType === "zipper").reduce((sum, m) => sum + m.totalCost, 0),
          count: materials.filter((m) => m.materialType === "zipper").length,
        },
        threads: {
          quantity: materials.filter((m) => m.materialType === "thread").reduce((sum, m) => sum + m.quantity, 0),
          cost: materials.filter((m) => m.materialType === "thread").reduce((sum, m) => sum + m.totalCost, 0),
          count: materials.filter((m) => m.materialType === "thread").length,
        },
        buttons: {
          quantity: materials.filter((m) => m.materialType === "button").reduce((sum, m) => sum + m.quantity, 0),
          cost: materials.filter((m) => m.materialType === "button").reduce((sum, m) => sum + m.totalCost, 0),
          count: materials.filter((m) => m.materialType === "button").length,
        },
        fabrics: {
          quantity: materials.filter((m) => m.materialType === "fabric").reduce((sum, m) => sum + m.quantity, 0),
          cost: materials.filter((m) => m.materialType === "fabric").reduce((sum, m) => sum + m.totalCost, 0),
          count: materials.filter((m) => m.materialType === "fabric").length,
        },
        accessories: {
          quantity: materials.filter((m) => m.materialType === "accessory").reduce((sum, m) => sum + m.quantity, 0),
          cost: materials.filter((m) => m.materialType === "accessory").reduce((sum, m) => sum + m.totalCost, 0),
          count: materials.filter((m) => m.materialType === "accessory").length,
        },
        velcro: {
          quantity: materials.filter((m) => m.materialType === "velcro").reduce((sum, m) => sum + m.quantity, 0),
          cost: materials.filter((m) => m.materialType === "velcro").reduce((sum, m) => sum + m.totalCost, 0),
          count: materials.filter((m) => m.materialType === "velcro").length,
        },
      },
    }

    const report: DetailedMaterialsReport = {
      materials,
      summary,
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error fetching detailed materials report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    logMemory("GET /api/materials-report/detailed - END", memBefore)

    if (global.gc) {
      global.gc()
      console.log("[v0] Garbage collection triggered after materials report")
    }
  }
}
