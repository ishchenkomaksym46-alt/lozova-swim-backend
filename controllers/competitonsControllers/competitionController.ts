import type {Context} from "hono";
import { competitionsService } from '../../services/competitionsServices/competitionService.js';

export default async function competitionControllers(c: Context) {
    try {
        const service = await competitionsService.getCompetitions();

        if(!service.success) {
            return c.json({ success: false, message: service.message });
        } else {
            return c.json({ success: true, data: service.data });
        }
    } catch (error: any) {
        console.error(error);
        return c.json({ success: false, message: 'Невідома помилка' });
    }
}