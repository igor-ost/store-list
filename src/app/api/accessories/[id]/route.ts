import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const accessories = await id

    await prisma.accessories.delete({
      where: { id: accessories },
    })
    console.log(req)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ошибка удаления:", error)
    return NextResponse.json(
      { error: "Не удалось удалить" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const accessories = await prisma.accessories.findUnique({
      where: {
        id: (id)
      },
    })

    if (!accessories) {
      return NextResponse.json(
        { error: `accessories with id ${id} not found` },
        { status: 404 }
      )
    }
    console.log(req)
    return NextResponse.json(accessories, { status: 200 })
  } catch (error: unknown) {
      if (error instanceof Error) {
        // Здесь доступен error.message
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // если ошибка не является экземпляром Error
      return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
    }
}



export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const updatedAccessory = await prisma.accessories.update({
      where: { id: id },
      data: data,
    });

    return NextResponse.json(updatedAccessory, { status: 200 });
  } catch (error: unknown) {
      if (error instanceof Error) {
        // Здесь доступен error.message
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // если ошибка не является экземпляром Error
      return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
    }
}