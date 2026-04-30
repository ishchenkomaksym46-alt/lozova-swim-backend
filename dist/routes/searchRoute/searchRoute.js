import { Hono } from "hono";
import searchSwimmersController from '../../controllers/searchControllers/searchSwimmersController.js';
import withPrisma from '../../src/lib/prisma.js';
const app = new Hono();
app.get('/swimmers', withPrisma, searchSwimmersController);
export default app;
