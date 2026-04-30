import { heatsService } from '../../services/heatsServices/heatsService.js';
export default async function heatsController(c) {
    const { id } = c.req.query();
    if (!id) {
        return c.json({ success: false, message: "Невірні дані" }, 400);
    }
    const distanceId = Number(id);
    if (isNaN(distanceId)) {
        return c.json({ success: false, message: "Невірний формат ID" }, 400);
    }
    try {
        const service = await heatsService.getHeats(distanceId);
        if (service.success) {
            return c.json({ success: true, data: service.data }, 200);
        }
        else {
            return c.json({ success: false, message: "Не вдаломя отримати данні" }, 400);
        }
    }
    catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
