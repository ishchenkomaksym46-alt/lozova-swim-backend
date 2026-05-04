import type {Context} from "hono";
import {protocolsService} from "../../services/protocolsService/protocolsService.js";

export default async function createProtocolController(c: Context) {
    const { competitionId } = c.req.query();
    const { header, text } = await c.req.json();

    if(!competitionId) {
        return c.json({ message: "ID змагання не отримано" }, 400);
    } else if (!header || !text) {
        return  c.json({ message: "Недостатньо данних для заповнення протокола" }, 400);
    }

    try {
        const service = await protocolsService.createProtocol(parseInt(competitionId), header, text);

        if(!service) {
            return c.json({ message: "Сервіс не знайдено" }, 400);
        }

        if(service.success) {
            return c.json({ message: "Протокол успішно доданий" }, 200);
        } else {
            return c.json({ message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ message: "Невідома помилка" }, 500);
    }
}