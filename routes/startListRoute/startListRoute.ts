import {Hono} from "hono";
import type {ContextWithPrisma} from "../../types/types.js";
import withPrisma from "../../src/lib/prisma.js";
import startListController from "../../controllers/startListControllers/startListController.js";

const app = new Hono<ContextWithPrisma>();

app.get("/", withPrisma, startListController);

export default app;
