import { Hono } from "hono";
import withPrisma from "../../src/lib/prisma.js";
import generateHeatsController from "../../controllers/seedingControllers/generateHeatsController.js";
import isAdminMiddleware from "../../middlewares/isAdminMiddleware.js";
const app = new Hono();
app.post("/generate", withPrisma, isAdminMiddleware, generateHeatsController);
export default app;
