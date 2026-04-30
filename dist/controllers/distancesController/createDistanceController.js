import { distancesServices } from '../../services/distancesServices/distancesServices.js';
export default async function createDistanceController(c) {
    const { id } = c.req.query();
    const { name } = await c.req.json();
    const competitionId = Number(id);
    if (!id || isNaN(competitionId)) {
        return c.json({ success: false, message: "Невірний ID змагання" }, 400);
    }
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
        return c.json({ success: false, message: "Назва дистанції повинна містити мінімум 3 символи" }, 400);
    }
    try {
        const service = await distancesServices.createDistance(competitionId, name);
        if (service.success) {
            return c.json({ success: true });
        }
        else {
            return c.json({ success: false, message: service.message });
        }
    }
    catch (e) {
        console.error(e);
        return c.json({ success: false, message: 'Помилка сервера' }, 500);
    }
}
