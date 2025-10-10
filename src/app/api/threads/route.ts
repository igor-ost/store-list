import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";



export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const threads = await prisma.threads.create({
      data: body,
    })

    return NextResponse.json(threads, { status: 201 })
  } catch (error) {


    console.error("Error creating:", error)
    return NextResponse.json({ error: "Не удалось создать" }, { status: 500 })
  }
}
export async function GET() {
  try {
    const threads = await prisma.threads.findMany({
    });

    return NextResponse.json(threads, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
  }
}
