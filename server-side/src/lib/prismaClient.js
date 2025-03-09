import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

prisma.$connect()
    .then(()=> console.log("Connected to database"))
    .catch(error => console.error("Failed to connect to database", error));