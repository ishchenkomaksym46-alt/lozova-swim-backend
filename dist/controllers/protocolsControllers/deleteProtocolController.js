import { protocolsService } from "../../services/protocolsService/protocolsService.js";
export default async function deleteProtocolController(c) {
    const { header } = await c.req.json();
    if (!header) {
        return c.json({ message: "Недостатньо данних" }, 400);
    }
    try {
        const service = await protocolsService.deleteProtocol(header);
        if (!service)
            return c.json({ message: "Сервіс не знайдено" }, 400);
        if (service.success) {
            return c.json({ message: "Протокол успішно видалено" }, 200);
        }
        else {
            return c.json({ message: service.message });
        }
    }
    catch (e) {
        console.error(e);
        return c.json({ message: "Невідома помилка" }, 500);
    }
}
