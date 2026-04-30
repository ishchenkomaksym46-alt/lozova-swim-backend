import type {Context} from "hono";
import {heatsService} from "../../services/heatsServices/heatsService.js";

export default async function heatDetailsController(c: Context) {
    const { heatId } = c.req.query();

    if (!heatId) {
        return c.json({ success: false, message: "ID запливу не надано" }, 400);
    }

    const id = Number(heatId);

    if (isNaN(id)) {
        return c.json({ success: false, message: "Невірний ID запливу" }, 400);
    }

    try {
        const service = await heatsService.getHeatDetails(id);

        if (service.success) {
            return c.json({ success: true, data: service.data }, 200);
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
