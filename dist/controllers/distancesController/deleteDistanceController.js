import { distancesServices } from '../../services/distancesServices/distancesServices.js';
export default async function deleteDistanceController(c) {
    const { name } = c.req.query();
    if (!name) {
        return c.json({ success: false, message: "Назва дистанції обов'язкова" }, 400);
    }
    try {
        const service = await distancesServices.deleteDistance(name);
        if (service.success) {
            return c.json({ success: true, message: "Дистанцію успішно видалено" });
        }
        else {
            return c.json({ success: false, message: service.message || "Помилка при видаленні дистанції" }, 500);
        }
    }
    catch (e) {
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
