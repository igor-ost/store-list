import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.fabrics.delete({
      where: { id: id },
    })

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
    const fabrics = await prisma.fabrics.findUnique({
      where: {
        id: (id)
      },
    })

    if (!fabrics) {
      return NextResponse.json(
        { error: `accessories with id ${id} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(fabrics, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
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
    const fabrics = await prisma.fabrics.update({
      where: { id: id },
      data: data,
    });

    return NextResponse.json(fabrics, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
  }
}