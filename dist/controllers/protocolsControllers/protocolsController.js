import { protocolsService } from "../../services/protocolsService/protocolsService.js";
export default async function protocolsController(c) {
    const { competitionId, page } = c.req.query();
    if (!competitionId || !page)
        return c.json({ message: "Недостатньо данних" }, 400);
    try {
        const service = await protocolsService.getProtocols(parseInt(competitionId), parseInt(page));
        if (!service)
            return c.json({ message: "Сервіс не знайдено" }, 400);
        if (service.success)
            return c.json({ protocol: service.protocol }, 200);
        else
            c.json({ message: service.message });
    }
    catch (e) {
        return c.json({ message: "Невідома помилка" }, 500);
    }
}
