import {Hono} from "hono";
import type {ContextWithPrisma} from "../../types/types.js";
import withPrisma from "../../src/lib/prisma.js";
import swimmerController from "../../controllers/swimmersControllers/swimmerController.js";
import createSwimmerController from "../../controllers/swimmersControllers/createSwimmerController.js";
import updateSwimmerController from "../../controllers/swimmersControllers/updateSwimmerController.js";
import deleteSwimmerController from "../../controllers/swimmersControllers/deleteSwimmerController.js";
import swimmerDetailsController from "../../controllers/swimmersControllers/swimmerDetailsController.js";
import isAdminMiddleware from "../../middlewares/isAdminMiddleware.js";

const app = new Hono<ContextWithPrisma>();

app.get('/', withPrisma, swimmerController);

app.get('/details', withPrisma, swimmerDetailsController);

app.post('/create', withPrisma, isAdminMiddleware, createSwimmerController);

app.put('/update', withPrisma, isAdminMiddleware, updateSwimmerController);

app.delete('/delete', withPrisma, isAdminMiddleware, deleteSwimmerController);

export default app;