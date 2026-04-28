import type {Context} from "hono";
import {entriesService} from "../../services/entriesService/entriesService.js";

export default async function createEntryController(c: Context) {
    const { competitionId, name } = await c.req.json();

    if (!competitionId || !name) {
        return c.json({ success: false, message: "Недостатньо даних" }, 400);
    }

    const compId = Number(competitionId);

    if (isNaN(compId)) {
        return c.json({ success: false, message: "Невірний формат даних" }, 400);
    }

    try {
        const service = await entriesService.createEntry(compId, name);

        if (service.success) {
            return c.json({ success: true, message: "Заявку створено", data: service.data });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
