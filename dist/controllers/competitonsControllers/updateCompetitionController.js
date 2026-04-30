import { competitionsService } from '../../services/competitionsServices/competitionService.js';
export default async function updateCompetitionController(c) {
    const { oldName, name, date } = await c.req.json();
    if (!name || !date || !oldName) {
        return c.json({ success: false, message: "Невірні дані" }, 400);
    }
    try {
        const service = await competitionsService.updateCompetition(oldName, name, date);
        if (service.success) {
            return c.json({ success: true, message: "Змагання успішно оновлено" });
        }
        else {
            return c.json({ success: false, message: service.message || "Помилка при оновленні змагання" }, 400);
        }
    }
    catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
