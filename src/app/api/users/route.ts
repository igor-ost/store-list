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


export async function POST(request: Request) {
  const body = await request.json();

  const hashedPassword = await bcrypt.hash(body.password, 10);
  
  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: hashedPassword
    },
  });

  return NextResponse.json(user);
}