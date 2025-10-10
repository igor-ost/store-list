import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";
import bcrypt from "bcrypt";

// export async function GET() {

//   const hashedPassword = await bcrypt.hash("H93wp21kls@", 10);
  
//   const user = await prisma.user.create({
//     data: {
//       email: "igorostap21.31@gmail.com",
//       name: "Игорь Остапенко",
//       password: hashedPassword,
//       role: "admin"
//     },
//   });

//   return NextResponse.json({status: "ok"});
// }

export async function GET() {

  try {
  const workers = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
})
    return NextResponse.json(workers, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  const body = await request.json();

  const hashedPassword = await bcrypt.hash(body.password, 10);
  
  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: hashedPassword,
      role: body.role
    },
  });

  return NextResponse.json(user);
}