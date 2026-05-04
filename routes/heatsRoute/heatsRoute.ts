import {Hono} from "hono";
import type {ContextWithPrisma} from '../../types/types.js';
import withPrisma from '../../src/lib/prisma.js';
import heatsController from '../../controllers/heatsControllers/heatsController.js';
import createHeatController from '../../controllers/heatsControllers/createHeatController.js';
import deleteHeatController from '../../controllers/heatsControllers/deleteHeatController.js';
import updateHeatController from '../../controllers/heatsControllers/updateHeatController.js';
import heatDetailsController from '../../controllers/heatsControllers/heatDetailsController.js';
import isAdminMiddleware from "../../middlewares/isAdminMiddleware.js";

const app = new Hono<ContextWithPrisma>();

app.get('/', withPrisma, heatsController);

app.get('/details', isAdminMiddleware, withPrisma, heatDetailsController);

app.post('/create', isAdminMiddleware, withPrisma, createHeatController);

app.put('/update', isAdminMiddleware, withPrisma, updateHeatController);

app.delete('/delete', isAdminMiddleware, withPrisma, deleteHeatController);

export default app;