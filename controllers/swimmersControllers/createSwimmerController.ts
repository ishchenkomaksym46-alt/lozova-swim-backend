import type {Context} from "hono";
import {swimmersService} from '../../services/swimmersService/swimmersServices.js';

export default async function createSwimmerController(c: Context) {
    const { name, surname, birthYear, competitionId } = await c.req.json();

    if (!name || !surname || !birthYear || !competitionId) {
        return c.json({ success: false, message: "Недостатньо даних" }, 400);
    }

    const year = Number(birthYear);
    const compId = Number(competitionId);

    if (isNaN(year) || isNaN(compId)) {
        return c.json({ success: false, message: "Невірний формат даних" }, 400);
    }

    try {
        const service = await swimmersService.createSwimmer(name, surname, year, compId);

        if (service.success) {
            return c.json({ success: true, message: "Учасника створено" });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
