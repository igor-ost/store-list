
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "../../../../../prisma/prisma-client";

export async function GET(request: Request) {
  try {

    const cookieStore = await cookies();
    let token = cookieStore.get("token")?.value;

    if (!token) {
      const auth = request.headers.get("authorization") || "";
      if (auth.startsWith("Bearer ")) {
        token = auth.slice(7);
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET не задан");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    let payload: JwtPayload | string;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ error: "Неизвестная ошибка" }, { status: 500 });
    }
    
    const p = typeof payload === "string" ? undefined : (payload as JwtPayload & { id?: string | number });

    const userId = p?.id;
    if (!userId) {
      return NextResponse.json({ error: "Неверный токен (нет id)" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json({ 
      id: user.id,
      name: user.name,
      email: user.email
     });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}


