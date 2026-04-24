import type {Context} from "hono";
import {resultsService} from "../../services/resultsServices/resultsService.js";

export default async function addResultController(c: Context) {
    const { participantId, time } = await c.req.json();

    if (!participantId || !time) {
        return c.json({ success: false, message: "Недостатньо даних" }, 400);
    }

    const partId = Number(participantId);

    if (isNaN(partId)) {
        return c.json({ success: false, message: "Невірний ID учасника" }, 400);
    }

    try {
        const service = await resultsService.addResult(partId, time);

        if (service.success) {
            return c.json({ success: true, message: "Результат додано" });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
