import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import type { ContextWithPrisma } from "../types/types.js";
import adminRoute from "../routes/adminRoute/adminRoute.js";
import { cors } from "hono/cors";
import 'dotenv/config';
import competitionsRoute from "../routes/competitionsRoute/competitionsRoute.js";
import distancesRoute from "../routes/distancesRoute/distancesRoute.js";
import heatsRoute from "../routes/heatsRoute/heatsRoute.js";
import swimmersRoute from "../routes/swimmersRoute/swimmersRoute.js";
import searchRoute from "../routes/searchRoute/searchRoute.js";
import resultsRoute from "../routes/resultsRoute/resultsRoute.js";
import protocolsRoute from "../routes/protocolsRoute/protocolsRoute.js";
import entriesRoute from "../routes/entriesRoute/entriesRoute.js";
import seedingRoute from "../routes/seedingRoute/seedingRoute.js";
import startListRoute from "../routes/startListRoute/startListRoute.js";

const app = new Hono<ContextWithPrisma>()

app.use('*', cors({
  origin: String(process.env.ORIGIN),
  credentials: true
}));

//admin
app.route('/admin', adminRoute);

//search
app.route('/search', searchRoute);

//competitions
app.route('/competitions', competitionsRoute);

//distances
app.route('/distances', distancesRoute);

//heats
app.route('/heats', heatsRoute);

//swimmers
app.route('/swimmers', swimmersRoute);

//results
app.route('/results', resultsRoute);

//protocols
app.route('/protocols', protocolsRoute);

//entries
app.route('/entries', entriesRoute);

//seeding
app.route('/seeding', seedingRoute);

//start-list
app.route('/start-list', startListRoute);

serve({
  fetch: app.fetch,
  port: 8000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
