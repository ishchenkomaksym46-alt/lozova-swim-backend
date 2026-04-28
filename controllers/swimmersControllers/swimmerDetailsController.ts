import type {Context} from "hono";
import {swimmersService} from "../../services/swimmersService/swimmersServices.js";


export default async function swimmerDetailsController(c: Context) {
    const { swimmerId, competitionId } = c.req.query();

    if(!swimmerId || !competitionId) {
        return c.json({ message: "Недостатньо данних" }, 400);
    }

    const swimId = Number(swimmerId);
    const compId = Number(competitionId);

    if (isNaN(swimId) || isNaN(compId)) {
        return c.json({ message: "Невірний формат даних" }, 400);
    }

    try {
        const service = await swimmersService.getSwimmerDetails(swimId, compId);

        if(!service) {
            return c.json({ message: "Сервісу не існує" })
        }

        if(service.success) {
            return c.json({ swimmer: service.swimmer }, 200);
        } else {
            return c.json({ message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ message: "Помилка сервера" });
    }
}
