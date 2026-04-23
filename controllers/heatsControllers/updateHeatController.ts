import type {Context} from "hono";
import {heatsService} from "../../services/heatsServices/heatsService.js";

export default async function updateHeatController(c: Context) {
    const { heatNumber, distanceId } = c.req.query();
    const body = await c.req.json();

    if (!heatNumber || !distanceId) {
        return c.json({ success: false, message: "Недостатньо даних" }, 400);
    }

    try {
        const service = await heatsService.updateHeat(
            Number(heatNumber),
            Number(distanceId),
            body.newHeatNumber,
            body.participants
        );

        if (service.success) {
            return c.json({ success: true, message: "Заплив успішно оновлено" });
        } else {
            return c.json({ success: false, message: service.message }, 400);
        }
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, message: "Невідома помилка" }, 500);
    }
}
