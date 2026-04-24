import {Hono} from "hono";
import type {ContextWithPrisma} from "../../types/types.js";
import withPrisma from "../../src/lib/prisma.js";
import uploadProtocolController from "../../controllers/protocolsControllers/uploadProtocolController.js";
import getProtocolController from "../../controllers/protocolsControllers/getProtocolController.js";
import isAdminMiddleware from "../../middlewares/isAdminMiddleware.js";

const app = new Hono<ContextWithPrisma>();

app.get('/', withPrisma, getProtocolController);

app.post('/upload', withPrisma, isAdminMiddleware, uploadProtocolController);

export default app;
