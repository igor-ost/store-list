import { PrismaClient } from "@prisma/client"

const PrismaClientSingleton = () => {
    return new PrismaClient();
}
 
declare global {
    var prismaGlobal: undefined | ReturnType<typeof PrismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton();

