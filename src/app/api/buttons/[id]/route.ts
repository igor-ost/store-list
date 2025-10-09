import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function DELETE(
  req: {id:string},
  { params }: { params: { id: string } }
) {
  try {
    const buttons = await params.id

    await prisma.buttons.delete({
      where: { id: buttons },
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
  { params }: { params: { id: string } }
) {
  try {
    const buttons = await prisma.buttons.findUnique({
      where: {
        id: (params.id)
      },
    })

    if (!buttons) {
      return NextResponse.json(
        { error: `accessories with id ${params.id} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(buttons, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching :", error)
    return NextResponse.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 }
    )
  }
}



export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const buttons = await prisma.buttons.update({
      where: { id: params.id },
      data: data,
    });

    return NextResponse.json(buttons, { status: 200 });
  } catch (error: any) {
    console.error("Ошибка обновления:", error);
    return NextResponse.json(
      { error: "Не удалось обновить", details: error.message },
      { status: 500 }
    );
  }
}