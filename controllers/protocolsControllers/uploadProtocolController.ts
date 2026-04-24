import type {Context} from "hono";
import {protocolsService} from "../../services/protocolsServices/protocolsService.js";

export default async function uploadProtocolController(c: Context) {
    const { competitionId, textContent } = await c.req.json();

    if (!competitionId) {
        return c.json({ success: false, message: "ID змагання не надано" }, 400);
    }

    const compId = Number(competitionId);

    if (isNaN(compId)) {
        return c.json({ success: false, message: "Невірний ID змагання" }, 400);
    }

    if (!textContent) {
        return c.json({ success: false, message: "Текст протоколу не надано" }, 400);
    }

    try {
        const service = await protocolsService.uploadProtocol(compId, textContent);

        if (service.success) {
            return c.json({ success: true, message: "Протокол завантажено" });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
