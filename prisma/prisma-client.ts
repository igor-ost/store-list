import { PrismaClient } from "@prisma/client"

const PrismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Limit connection pool to prevent memory issues
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }).$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const start = Date.now()
          const result = await query(args)
          const end = Date.now()

          if (end - start > 1000) {
            console.log(`[v0] Slow query detected: ${model}.${operation} took ${end - start}ms`)
          }

          return result
        },
      },
    },
  })
}

declare global {
  // @ts-ignore
  var prismaGlobal: ReturnType<typeof PrismaClientSingleton> | undefined
}

export const prisma = globalThis.prismaGlobal ?? (globalThis.prismaGlobal = PrismaClientSingleton())

if (process.env.NODE_ENV !== "production") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect()
  })
}
