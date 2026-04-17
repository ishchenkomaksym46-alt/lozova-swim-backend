import 'dotenv/config';
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../generated/prisma/client.js";
import type {Context, Next} from "hono";

const database_url = process.env.DATABASE_URL;

if(!database_url) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}

const adapter = new PrismaPg({
    connectionString: database_url
});

const prisma = new PrismaClient({
    adapter
});

function withPrisma(c: Context, next: Next) {
    if(!c.get('prisma')) {
        c.set('prisma', prisma)
    }
    return next();
}

export default withPrisma;
export { prisma };