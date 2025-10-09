import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";



export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const accessories = await prisma.accessories.create({
      data: body,
    })

    return NextResponse.json(accessories, { status: 201 })
  } catch (error) {


    console.error("Error creating:", error)
    return NextResponse.json({ error: "Не удалось создать" }, { status: 500 })
  }
}
export async function GET() {
  try {
    const accessories = await prisma.accessories.findMany({
    });

    return NextResponse.json(accessories, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching:", error);
    return NextResponse.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 }
    );
  }
}
