import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";



export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const zippers = await prisma.zippers.create({
      data: body,
    })

    return NextResponse.json(zippers, { status: 201 })
  } catch (error) {


    console.error("Error creating:", error)
    return NextResponse.json({ error: "Не удалось создать" }, { status: 500 })
  }
}
export async function GET() {
  try {
    const zippers = await prisma.zippers.findMany({
    });

    return NextResponse.json(zippers, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching:", error);
    return NextResponse.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 }
    );
  }
}
