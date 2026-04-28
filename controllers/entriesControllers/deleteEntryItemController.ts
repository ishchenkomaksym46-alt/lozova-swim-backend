import type {Context} from "hono";
import {entriesService} from "../../services/entriesService/entriesService.js";

export default async function deleteEntryItemController(c: Context) {
    const { id } = await c.req.json();

    if (!id) {
        return c.json({ success: false, message: "ID учасника не вказано" }, 400);
    }

    const itemId = Number(id);

    if (isNaN(itemId)) {
        return c.json({ success: false, message: "Невірний ID учасника" }, 400);
    }

    try {
        const service = await entriesService.deleteEntryItem(itemId);

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
