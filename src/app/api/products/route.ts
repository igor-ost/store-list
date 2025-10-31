import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";


interface MaterialItem {
  id: string
  qty: number
  color?: string
  type?: string
  name?: string
  unit?: string
  price?: number
}

interface RequestBody {
  name: string
  description?: string
  materials: {
    zippers?: MaterialItem[]
    threads?: MaterialItem[]
    buttons?: MaterialItem[]
    fabrics?: MaterialItem[]
    accessories?: MaterialItem[]
    velcro?: MaterialItem[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()

    const orderTemplate = await prisma.orderTemplate.create({
      data: {
        name: body.name,
        description: body.description || null,
        zippers: {
          create:
            body.materials.zippers?.map((zipper) => ({
              zipperId: zipper.id,
              qty: zipper.qty,
            })) || [],
        },
        threads: {
          create:
            body.materials.threads?.map((thread) => ({
              threadId: thread.id,
              qty: thread.qty,
            })) || [],
        },
        buttons: {
          create:
            body.materials.buttons?.map((button) => ({
              buttonId: button.id,
              qty: button.qty,
            })) || [],
        },
        fabrics: {
          create:
            body.materials.fabrics?.map((fabric) => ({
              fabricId: fabric.id,
              qty: fabric.qty,
            })) || [],
        },
        accessories: {
          create:
            body.materials.accessories?.map((accessory) => ({
              accessoryId: accessory.id,
              qty: accessory.qty,
            })) || [],
        },
        velcro: {
          create:
            body.materials.velcro?.map((velcroItem) => ({
              velcroId: velcroItem.id,
              qty: velcroItem.qty,
            })) || [],
        },
      },
      include: {
        zippers: {
          include: {
            zipper: true,
          },
        },
        threads: {
          include: {
            thread: true,
          },
        },
        buttons: {
          include: {
            button: true,
          },
        },
        fabrics: {
          include: {
            fabric: true,
          },
        },
        accessories: {
          include: {
            accessory: true,
          },
        },
        velcro: {
          include: {
            velcro: true,
          },
        },
      },
    })

    return NextResponse.json(orderTemplate, { status: 201 })
  } catch (error) {
    console.error("Error creating order template:", error)
    return NextResponse.json(
      { error: "Не удалось создать шаблон заказа", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const orderTemplates = await prisma.orderTemplate.findMany({
      include: {
        zippers: {
          include: {
            zipper: true,
          },
        },
        threads: {
          include: {
            thread: true,
          },
        },
        buttons: {
          include: {
            button: true,
          },
        },
        fabrics: {
          include: {
            fabric: true,
          },
        },
        accessories: {
          include: {
            accessory: true,
          },
        },
        velcro: {
          include: {
            velcro: true,
          },
        },
      },
    })

    return NextResponse.json(orderTemplates, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 })
  }
}
