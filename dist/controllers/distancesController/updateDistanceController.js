import { distancesServices } from '../../services/distancesServices/distancesServices.js';
export default async function updateDistanceController(c) {
    const { oldName, name } = await c.req.json();
    if (!oldName || !name) {
        return c.json({ success: false, message: "Невірні дані" }, 400);
    }
    try {
        const service = await distancesServices.updateDistance(oldName, name);
        if (service.success) {
            return c.json({ success: true, message: "Дистанція успішно оновлена" });
        }
        else {
            return c.json({ success: false, message: " Помилка при оновленні дистанції" }, 400);
        }
    }
    catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" });
    }
}
