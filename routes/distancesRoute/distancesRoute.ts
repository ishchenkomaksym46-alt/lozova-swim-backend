import {Hono} from "hono";
import type {ContextWithPrisma} from "../../types/types.js";
import distancesController from "../../controllers/distancesController/distancesController.js";
import withPrisma from "../../src/lib/prisma.js";
import createDistanceController from "../../controllers/distancesController/createDistanceController.js";
import isAdminMiddleware from "../../middlewares/isAdminMiddleware.js";
import deleteDistanceController from "../../controllers/distancesController/deleteDistanceController.js";
import updateDistanceController from "../../controllers/distancesController/updateDistanceController.js";

const app = new Hono<ContextWithPrisma>();

app.get('/', withPrisma, distancesController);

app.post('/create', withPrisma, isAdminMiddleware, createDistanceController);

app.delete('/delete', withPrisma, isAdminMiddleware, deleteDistanceController);

app.patch('/update', withPrisma, isAdminMiddleware, updateDistanceController);

export default app;