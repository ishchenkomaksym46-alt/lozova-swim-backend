import 'dotenv/config';
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
const database_url = process.env.DATABASE_URL;
if (!database_url) {
    throw new Error('DATABASE_URL is not defined in environment variables');
}
const adapter = new PrismaPg({
    connectionString: database_url,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});
const prisma = new PrismaClient({
    adapter,
    transactionOptions: {
        maxWait: 10000, // 10 seconds
        timeout: 20000, // 20 seconds
    }
});
function withPrisma(c, next) {
    if (!c.get('prisma')) {
        c.set('prisma', prisma);
    }
    return next();
}
export default withPrisma;
export { prisma };
