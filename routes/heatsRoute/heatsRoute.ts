import {Hono} from "hono";
import type {ContextWithPrisma} from '../../types/types.js';
import withPrisma from '../../src/lib/prisma.js';
import heatsController from '../../controllers/heatsControllers/heatsController.js';
import createHeatController from '../../controllers/heatsControllers/createHeatController.js';
import deleteHeatController from '../../controllers/heatsControllers/deleteHeatController.js';
import updateHeatController from '../../controllers/heatsControllers/updateHeatController.js';

const app = new Hono<ContextWithPrisma>();

app.get('/', withPrisma, heatsController);

app.post('/create', withPrisma, createHeatController);

app.put('/update', withPrisma, updateHeatController);

app.delete('/delete', withPrisma, deleteHeatController);

export default app;