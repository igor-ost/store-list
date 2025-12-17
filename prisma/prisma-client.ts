import { PrismaClient } from "@prisma/client";

const PrismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // @ts-ignore
  var prismaGlobal: PrismaClient | undefined;
}

// Используем существующий глобальный клиент или создаём новый и сохраняем его
export const prisma =
  globalThis.prismaGlobal ?? (globalThis.prismaGlobal = PrismaClientSingleton());