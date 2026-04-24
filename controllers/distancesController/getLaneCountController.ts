import type {Context} from "hono";
import {distancesServices} from "../../services/distancesServices/distancesServices.js";

export default async function getLaneCountController(c: Context) {
    const { id } = c.req.query();

    const distanceId = Number(id);

    if (!id || isNaN(distanceId)) {
        return c.json({ success: false, message: "Невірний ID дистанції" }, 400);
    }

    try {
        const service = await distancesServices.getLaneCount(distanceId);

        if(service.success) {
            return c.json({ success: true, laneCount: service.laneCount });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Невідома помилка" });
    }
}
