import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function DELETE(req: { id: string; order_number: string }, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      select: { image_urls: true },
    })

    if (order && order.image_urls && order.image_urls.length > 0) {
      for (const imageUrl of order.image_urls) {
        try {
          const fileName = imageUrl.split("/").pop()
          if (fileName) {
            const filePath = join(process.cwd(), "public", "uploads", fileName)
            if (existsSync(filePath)) {
              await unlink(filePath)
              console.log(`[v0] Deleted image file: ${fileName}`)
            }
          }
        } catch (fileError) {
          console.error(`[v0] Error deleting image file ${imageUrl}:`, fileError)
          // Continue with deletion even if file deletion fails
        }
      }
    }

    await prisma.zippers.deleteMany({
      where: { order_id: orderId },
    })

    await prisma.fabrics.deleteMany({
      where: { order_id: orderId },
    })

    await prisma.orders.delete({
      where: { id: orderId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления заказа:", error)
    return NextResponse.json({ error: "Не удалось удалить заказ" }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.orders.findUnique({
      where: {
        id: (params.id)
      },
      include: {
        fabrics: true,
        zippers: true,
        customer: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: `Order with id ${params.id} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order", details: error.message },
      { status: 500 }
    )
  }
}
