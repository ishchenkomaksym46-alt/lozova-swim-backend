import {Hono} from "hono";
import type {ContextWithPrisma} from '../../types/types.js';
import searchSwimmersController from '../../controllers/searchControllers/searchSwimmersController.js';
import withPrisma from '../../src/lib/prisma.js';

const app = new Hono<ContextWithPrisma>();

app.get('/swimmers', withPrisma, searchSwimmersController);

export default app;