import type {Context} from "hono";
import {entriesService} from "../../services/entriesService/entriesService.js";

export default async function deleteEntryController(c: Context) {
    const { id } = await c.req.json();

    if (!id) {
        return c.json({ success: false, message: "ID заявки не вказано" }, 400);
    }

    const entryId = Number(id);

    if (isNaN(entryId)) {
        return c.json({ success: false, message: "Невірний ID заявки" }, 400);
    }

    try {
        const service = await entriesService.deleteEntry(entryId);

        if (service.success) {
            return c.json({ success: true, message: "Заявку видалено" });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
