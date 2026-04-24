import type {Context} from "hono";
import {swimmersService} from "../../services/swimmersService/swimmersServices.js";

export default async function deleteSwimmerController(c: Context) {
    const { id } = c.req.query();

    if (!id) {
        return c.json({ success: false, message: "ID учасника не надано" }, 400);
    }

    const swimmerId = Number(id);

    if (isNaN(swimmerId)) {
        return c.json({ success: false, message: "Невірний ID учасника" }, 400);
    }

    try {
        const service = await swimmersService.deleteSwimmer(swimmerId);

        if (service.success) {
            return c.json({ success: true, message: "Учасника видалено" });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
