import type {Context} from "hono";
import {heatsService} from "../../services/heatsServices/heatsService.js";

export default async function updateHeatController(c: Context) {
    const { heatNumber, distanceId } = c.req.query();
    const body = await c.req.json();

    if (!heatNumber || !distanceId) {
        return c.json({ success: false, message: "Недостатньо даних" }, 400);
    }

    try {
        const heatNum = Number(heatNumber);
        const distanceNum = Number(distanceId);

        if (isNaN(heatNum) || isNaN(distanceNum)) {
            return c.json({ success: false, message: "Невірний формат даних" }, 400);
        }

        if (body.newHeatNumber !== undefined && isNaN(Number(body.newHeatNumber))) {
            return c.json({ success: false, message: "Невірний формат нового номера запливу" }, 400);
        }

        const service = await heatsService.updateHeat(
            heatNum,
            distanceNum,
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
