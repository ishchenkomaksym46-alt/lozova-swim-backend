import type {Context} from "hono";
import {heatsService} from "../../services/heatsServices/heatsService.js";

export default async function createHeatController(c: Context) {
    const { participants, heatNumber } = await c.req.json();
    const { id } = c.req.query();

    try {
        const service = await heatsService.createHeat(Number(id), heatNumber, participants);

        if(service.success) {
            return c.json({ success: true });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Невідома помилка" });
    }
}