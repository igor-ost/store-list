import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";


export async function GET() {
  try {
    const threads = await prisma.threads.findMany({});
    const accessories = await prisma.accessories.findMany({})
    const buttons = await prisma.buttons.findMany({})
    const velcro = await prisma.velcro.findMany({})
    const zippers = await prisma.zippers.findMany({})
    const fabrics = await prisma.fabrics.findMany({})

     const materials = {
      zippers: zippers,
      velcro: velcro,
      threads: threads,
      fabrics: fabrics,
      buttons: buttons,
      accessories: accessories
    }


    return NextResponse.json(materials, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
  }
}
