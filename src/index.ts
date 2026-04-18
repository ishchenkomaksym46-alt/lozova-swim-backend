import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import type { ContextWithPrisma } from "../types/types.js";
import adminRoute from "../routes/adminRoute/adminRoute.js";
import { cors } from "hono/cors";
import 'dotenv/config';
import competitionsRoute from "../routes/competitionsRoute/competitionsRoute.js";
import distancesRoute from "../routes/distancesRoute/distancesRoute.js";
import heatsRoute from "../routes/heatsRoute/heatsRoute.js";

const app = new Hono<ContextWithPrisma>()

app.use('*', cors({
  origin: String(process.env.ORIGIN),
  credentials: true
}));

//admin
app.route('/admin', adminRoute);

//competitions
app.route('/competitions', competitionsRoute);

//distances
app.route('/distances', distancesRoute);

//heats
app.route('/heats', heatsRoute);

serve({
  fetch: app.fetch,
  port: 8000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
