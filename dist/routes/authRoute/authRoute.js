import { Hono } from "hono";
import { adminLogin } from '../../controllers/authController/authController.js';
const authRoute = new Hono();
authRoute.post('/login', adminLogin);
export default authRoute;
