import { competitionsService } from '../../services/competitionsServices/competitionService.js';
export default async function createCompetitionController(c) {
    const { name, date, laneCount, ageGroups } = await c.req.json();
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
        return c.json({ success: false, message: "Назва змагання повинна містити мінімум 3 символи" }, 400);
    }
    if (!date || typeof date !== 'string' || date.trim().length < 3) {
        return c.json({ success: false, message: "Дата проведення обов'язкова" }, 400);
    }
    const lanes = laneCount || 6;
    if (isNaN(Number(lanes)) || lanes < 1 || lanes > 10) {
        return c.json({ success: false, message: "Кількість доріжок повинна бути від 1 до 10" }, 400);
    }
    const ageGroupsStr = ageGroups || "10 і молодше,11-12,13-14,15-16,17-18,19+";
    try {
        const service = await competitionsService.createCompetition(name, date, lanes, ageGroupsStr);
        if (!service.success) {
            return c.json({ success: false, message: service.message });
        }
        return c.json({ success: true });
    }
    catch (error) {
        console.error(error);
        return c.json({ success: false, message: 'Невідома помилка' });
    }
}
