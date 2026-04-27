import type {Context} from "hono";
import { competitionsService } from '../../services/competitionsServices/competitionService.js';

export default async function createCompetitionController(c: Context) {
    const { name, date, laneCount } = await c.req.json();

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

    try {
        const service = await competitionsService.createCompetition(name, date, lanes);

        if(!service.success) {
            return c.json({ success: false, message: service.message });
        }

        return c.json({ success: true });
    } catch (error: any) {
        console.error(error);
        return c.json({ success: false, message: 'Невідома помилка' });
    }
}