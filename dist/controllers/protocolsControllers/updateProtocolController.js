import { protocolsService } from "../../services/protocolsService/protocolsService.js";
export default async function updateProtocolController(c) {
    const { oldHeader, newHeader, text } = await c.req.json();
    if (!oldHeader || !text || !newHeader) {
        return c.json({ message: "Недостатньо данних" }, 400);
    }
    try {
        const service = await protocolsService.updateProtocol(oldHeader, newHeader, text);
        if (!service)
            return c.json({ message: "Сервіс не знайдено" }, 400);
        if (service.success)
            return c.json({ message: "Протокол успшно виправлений" }, 200);
        else
            c.json({ message: service.message });
    }
    catch (e) {
        console.error(e);
        return c.json({ message: "Помилка сервера" }, 500);
    }
}
