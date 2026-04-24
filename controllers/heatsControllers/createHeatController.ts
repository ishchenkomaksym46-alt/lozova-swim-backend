import type {Context} from "hono";
import {heatsService} from "../../services/heatsServices/heatsService.js";

export default async function createHeatController(c: Context) {
    const { participants, heatNumber } = await c.req.json();
    const { id } = c.req.query();

    const distanceId = Number(id);

    if (!id || isNaN(distanceId)) {
        return c.json({ success: false, message: "Невірний ID дистанції" }, 400);
    }

    if (!heatNumber || isNaN(Number(heatNumber))) {
        return c.json({ success: false, message: "Невірний номер запливу" }, 400);
    }

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
        return c.json({ success: false, message: "Список учасників порожній або невірний" }, 400);
    }

    try {
        const service = await heatsService.createHeat(distanceId, heatNumber, participants);

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