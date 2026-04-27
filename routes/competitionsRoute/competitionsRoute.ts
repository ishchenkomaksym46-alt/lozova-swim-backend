import {Hono} from "hono";
import type {ContextWithPrisma} from '../../types/types.js';
import competitionController from '../../controllers/competitonsControllers/competitionController.js';
import withPrisma from '../../src/lib/prisma.js';
import isAdminMiddleware from '../../middlewares/isAdminMiddleware.js';
import createCompetitionController from '../../controllers/competitonsControllers/createCompetitionController.js';
import deleteCompetitionController from '../../controllers/competitonsControllers/deleteCompetitionController.js';
import updateCompetitionController from '../../controllers/competitonsControllers/updateCompetitionController.js';

const app = new Hono<ContextWithPrisma>();

app.get('/', withPrisma, competitionController);

app.post('/create', withPrisma, isAdminMiddleware, createCompetitionController);

app.delete('/delete', withPrisma, isAdminMiddleware, deleteCompetitionController);

app.patch('/update', withPrisma, isAdminMiddleware, updateCompetitionController);

export default app;