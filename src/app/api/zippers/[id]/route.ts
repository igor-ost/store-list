import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }>}
) {
  try {
    const { id } = await context.params;

    await prisma.zippers.delete({
      where: { id: id },
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
  context: { params: Promise<{ id: string }>}
) {
  try {
    const { id } = await context.params;

    const zippers = await prisma.zippers.findUnique({
      where: {
        id: (id)
      },
    })

    if (!zippers) {
      return NextResponse.json(
        { error: `accessories with id ${id} not found` },
        { status: 404 }
      )
    }
    console.log(req)
    return NextResponse.json(zippers, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
  }
}



export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }>}
) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const zippers = await prisma.zippers.update({
      where: { id: id },
      data: data,
    });
    console.log(req)
    return NextResponse.json(zippers, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
  }
}