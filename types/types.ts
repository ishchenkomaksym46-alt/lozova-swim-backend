import { PrismaClient } from "../src/generated/prisma/client.js";

export interface JWTPayload {
    isAdmin: boolean;
    iat?: number;
    exp?: number;
}

export type ContextWithPrisma = {
    Variables: {
        prisma: PrismaClient;
        user?: JWTPayload;
    }
}