import {Hono} from "hono";
import type {ContextWithPrisma} from "../../types/types.js";
import withPrisma from "../../src/lib/prisma.js";
import generateHeatsController from "../../controllers/seedingControllers/generateHeatsController.js";
import isAdminMiddleware from "../../middlewares/isAdminMiddleware.js";

const app = new Hono<ContextWithPrisma>();

app.post("/generate", withPrisma, isAdminMiddleware, generateHeatsController);

export default app;
