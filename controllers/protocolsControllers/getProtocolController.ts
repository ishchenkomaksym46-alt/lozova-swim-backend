import type {Context} from "hono";
import {protocolsService} from "../../services/protocolsServices/protocolsService.js";

export default async function getProtocolController(c: Context) {
    const { id } = c.req.query();

    if (!id) {
        return c.json({ success: false, message: "ID змагання не надано" }, 400);
    }

    const competitionId = Number(id);

    if (isNaN(competitionId)) {
        return c.json({ success: false, message: "Невірний ID змагання" }, 400);
    }

    try {
        const service = await protocolsService.getProtocol(competitionId);

        if (service.success) {
            return c.json({ success: true, data: service.data }, 200);
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
