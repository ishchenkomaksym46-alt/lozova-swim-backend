import {Hono} from "hono";
import type {ContextWithPrisma} from "../../types/types.js";
import withPrisma from "../../src/lib/prisma.js";
import protocolsController from "../../controllers/protocolsControllers/protocolsController.js";
import createProtocolController from "../../controllers/protocolsControllers/createProtocolController.js";
import updateProtocolController from "../../controllers/protocolsControllers/updateProtocolController.js";
import isAdminMiddleware from "../../middlewares/isAdminMiddleware.js";
import deleteProtocolController from "../../controllers/protocolsControllers/deleteProtocolController.js";

const app = new Hono<ContextWithPrisma>();

app.get('/', withPrisma, protocolsController);

app.post('/create', withPrisma, isAdminMiddleware, createProtocolController);

app.put('/update', withPrisma, isAdminMiddleware, updateProtocolController);

app.delete('/delete', withPrisma, isAdminMiddleware, deleteProtocolController);

export default app;