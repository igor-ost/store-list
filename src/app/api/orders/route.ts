/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { prisma } from "../../../../prisma/prisma-client"
import { getMemoryStats, logMemory } from "../../../../lib/memory-logger"

export async function POST(req: Request) {
  const memBefore = getMemoryStats()
  logMemory("POST /api/orders - START")

  try {
    const body = await req.json()
    const { general, materials, user_id } = body

    console.log("[v0] Creating order with data:", JSON.stringify(body, null, 2))

    const now = new Date()
    const dd = String(now.getDate()).padStart(2, "0")
    const mm = String(now.getMonth() + 1).padStart(2, "0")
    const yy = String(now.getFullYear()).slice(-2)
    const datePrefix = `${dd}${mm}${yy}`

    // Ищем последний заказ за этот день
    const lastOrder = await prisma.orders.findFirst({
      where: {
        order_number: {
          startsWith: datePrefix,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })

    let newIncrement = 1

    if (lastOrder) {
      const lastNumber = lastOrder.order_number.split("_")[1]
      newIncrement = Number(lastNumber) + 1
    }

    const generatedOrderNumber = `${datePrefix}_${String(newIncrement).padStart(6, "0")}`

    // Create order with materials in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.orders.create({
        data: {
          order_number: generatedOrderNumber,
          order_date: new Date(general.order_date),
          customer_id: general.customer_id,
          product_name: general.product_name,
          quantity: general.quantity,
          quantity_buttons: general.quantity_buttons,
          status: general.status,
          notes: general.notes,
          user_id: user_id,
          image_urls: general.image_urls,
          product_id: general.product_id,
          description: general.description,
          cutting_price: general.cutting_price,
          sewing_price: general.sewing_price,
        },
      })

      console.log("[v0] Order created with ID:", order.id)

      if (materials) {
        if (materials.zippers && materials.zippers.length > 0) {
          await tx.orderZipper.createMany({
            data: materials.zippers.map((zipper: any) => ({
              orderId: order.id,
              zipperId: zipper.id,
              qty: zipper.qty,
              price: zipper.price,
            })),
          })
        }

        if (materials.threads && materials.threads.length > 0) {
          await tx.orderThread.createMany({
            data: materials.threads.map((thread: any) => ({
              orderId: order.id,
              threadId: thread.id,
              qty: thread.qty,
              price: thread.price,
            })),
          })
        }

        if (materials.buttons && materials.buttons.length > 0) {
          await tx.orderButton.createMany({
            data: materials.buttons.map((button: any) => ({
              orderId: order.id,
              buttonId: button.id,
              qty: button.qty,
              price: button.price,
            })),
          })
        }

        if (materials.fabrics && materials.fabrics.length > 0) {
          await tx.orderFabric.createMany({
            data: materials.fabrics.map((fabric: any) => ({
              orderId: order.id,
              fabricId: fabric.id,
              qty: fabric.qty,
              price: fabric.price,
            })),
          })
        }

        if (materials.accessories && materials.accessories.length > 0) {
          await tx.orderAccessory.createMany({
            data: materials.accessories.map((accessory: any) => ({
              orderId: order.id,
              accessoryId: accessory.id,
              qty: accessory.qty,
              price: accessory.price,
            })),
          })
        }

        if (materials.velcro && materials.velcro.length > 0) {
          await tx.orderVelcro.createMany({
            data: materials.velcro.map((velcroItem: any) => ({
              orderId: order.id,
              velcroId: velcroItem.id,
              qty: velcroItem.qty,
              price: velcroItem.price,
            })),
          })
        }
      }

      const completeOrder = await tx.orders.findUnique({
        where: { id: order.id },
        include: {
          orderZippers: {
            include: { zipper: true },
          },
          orderThreads: {
            include: { thread: true },
          },
          orderButtons: {
            include: { button: true },
          },
          orderFabrics: {
            include: { fabric: true },
          },
          orderAccessories: {
            include: { accessory: true },
          },
          orderVelcro: {
            include: { velcro: true },
          },
          customer: true,
        },
      })

      console.log("[v0] Order created successfully with materials")
      return completeOrder
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: unknown) {
    console.error("[v0] Order creation error:", error)
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
          details: "Проверьте, что все ID материалов существуют в базе данных",
        },
        { status: 500 },
      )
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 })
  } finally {
    logMemory("POST /api/orders - END", memBefore)
  }
}

export async function GET(req: Request) {
  const memBefore = getMemoryStats()
  logMemory("GET /api/orders - START")

  try {
    const orders = await prisma.orders.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        customer: true,
      },
    })
    console.log(req)
    return NextResponse.json(orders, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 })
  } finally {
    logMemory("GET /api/orders - END", memBefore)
  }
}
