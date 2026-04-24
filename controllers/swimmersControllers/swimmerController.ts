import type {Context} from "hono";
import {swimmersService} from "../../services/swimmersService/swimmersServices.js";


export default async function SwimmerController(c: Context) {
    const { competitionId, page = 1 } = c.req.query();

    if(!competitionId || !page) {
        return c.json({ message: "Недостатньо данних" }, 400);
    }

    const compId = Number(competitionId);
    const pageNum = Number(page);

    if (isNaN(compId) || isNaN(pageNum)) {
        return c.json({ message: "Невірний формат даних" }, 400);
    }

    if (pageNum < 1) {
        return c.json({ message: "Номер сторінки повинен бути більше 0" }, 400);
    }

    try {
        const service = await swimmersService.getSwimmers(compId, pageNum);

        if(!service) {
            return c.json({ message: "Сервісу не існує" })
        }

        if(service.success) {
            return c.json({ swimmers: service.swimmers }, 200);
        } else {
            return c.json({ message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ message: "Помилка сервера" });
    }
}