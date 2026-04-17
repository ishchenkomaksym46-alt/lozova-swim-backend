import type {Context} from "hono";
import {distancesServices} from "../../services/distancesServices/distancesServices.js";

export default async function createDistanceController(c: Context) {
    const { id } = c.req.query();
    const { name } = await c.req.json();

    try {
        const service = await distancesServices.createDistance(Number(id), name);

        if(service.success) {
            return c.json({ success: true });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, message: 'Помилка сервера' }, 500);
    }
}