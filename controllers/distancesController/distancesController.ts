import type {Context} from "hono";
import {distancesServices} from "../../services/distancesServices/distancesServices.js";

export default async function distancesController(c: Context) {
    const { id } = c.req.query();

    try {
        const service = await distancesServices.getDistances(id);

        if(service.success) {
            return c.json({ success: true, distances: service.distances });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, message: 'Помилка сервера' }, 500);
    }
}