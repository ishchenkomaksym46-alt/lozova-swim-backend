import { entriesService } from "../../services/entriesService/entriesService.js";
export default async function entriesController(c) {
    const { id } = c.req.query();
    const competitionId = Number(id);
    if (!id || isNaN(competitionId)) {
        return c.json({ success: false, message: "Невірний ID змагання" }, 400);
    }
    try {
        const service = await entriesService.getEntries(competitionId);
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
