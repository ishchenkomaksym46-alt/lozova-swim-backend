import type {Context} from "hono";
import { competitionsService } from "../../services/competitionsServices/competitionService.js";

export default async function createCompetitionController(c: Context) {
    const { name, date } = await c.req.json();

    try {
        const service = await competitionsService.createCompetition(name, date);

        if(!service.success) {
            return c.json({ success: false, message: service.message });
        }

        return c.json({ success: true });
    } catch (error: any) {
        console.error(error);
        return c.json({ success: false, message: 'Невідома помилка' });
    }
}