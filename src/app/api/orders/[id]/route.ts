import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function DELETE(req: Request,  context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const order = await prisma.orders.findUnique({
      where: { id: id },
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
        
        }
      }
    }

    await prisma.orders.delete({
      where: { id: id },
    })
    console.log(req)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления заказа:", error)
    return NextResponse.json({ error: "Не удалось удалить заказ" }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }>}
) {
  try {
    const { id } = await context.params;
    const order = await prisma.orders.findUnique({
      where: {
        id: (id)
      },
      include: {
        customer: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: `Order with id ${id} not found` },
        { status: 404 }
      )
    }
    console.log(req)
    return NextResponse.json(order, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
  }
}
