import { prisma } from "../../../../../prisma/prisma-client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }


    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET не задан в окружении");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const expiresIn = 7 * 24 * 60 * 60;
    const signOptions: SignOptions = { expiresIn };

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      signOptions
    );

    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      token, 
    });


    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60, 
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Ошибка при входе" }, { status: 500 });
  }
}
