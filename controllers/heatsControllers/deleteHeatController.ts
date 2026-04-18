import type {Context} from "hono";
import {heatsService} from "../../services/heatsServices/heatsService.js";

export default async function deleteHeatController(c: Context) {
    const { id } = c.req.query();

    if(!id) {
        return c.json({ success: false, message: "Поле ID обовязкове" });
    }

    try {
        const service = await heatsService.deleteHeat(Number(id));

        if(service.success) {
            return c.json({ success: true })
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        return c.json({ success: false, message: "Невідома помилка" });
    }
}