import { Hono } from "hono";
import withPrisma from '../../src/lib/prisma.js';
import addResultController from '../../controllers/resultsControllers/addResultController.js';
import getResultsController from '../../controllers/resultsControllers/getResultsController.js';
import isAdminMiddleware from '../../middlewares/isAdminMiddleware.js';
const app = new Hono();
app.get('/', withPrisma, getResultsController);
app.post('/add', withPrisma, isAdminMiddleware, addResultController);
export default app;
