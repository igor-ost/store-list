import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }>}
) {
  try {
    const { id } = await context.params;

    await prisma.threads.delete({
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
    const threads = await prisma.threads.findUnique({
      where: {
        id: (id)
      },
    })

    if (!threads) {
      return NextResponse.json(
        { error: `accessories with id ${id} not found` },
        { status: 404 }
      )
    }
    console.log(req)
    return NextResponse.json(threads, { status: 200 })
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

    const threads = await prisma.threads.update({
      where: { id: id },
      data: data,
    });

    return NextResponse.json(threads, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
  }
}