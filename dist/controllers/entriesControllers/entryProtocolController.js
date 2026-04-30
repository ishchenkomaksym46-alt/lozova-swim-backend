import { entriesService } from "../../services/entriesService/entriesService.js";
export default async function entryProtocolController(c) {
    const { id } = c.req.query();
    const distanceId = Number(id);
    if (!id || isNaN(distanceId)) {
        return c.json({ success: false, message: "Невірний ID дистанції" }, 400);
    }
    try {
        const service = await entriesService.getEntryProtocol(distanceId);
        if (service.success) {
            return c.json({ success: true, data: service.data });
        }
        else {
            return c.json({ success: false, message: service.message });
        }
    }
    catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Невідома помилка" }, 500);
    }
}
