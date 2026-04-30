import { Hono } from "hono";
import withPrisma from "../../src/lib/prisma.js";
import startListController from "../../controllers/startListControllers/startListController.js";
const app = new Hono();
app.get("/", withPrisma, startListController);
export default app;
