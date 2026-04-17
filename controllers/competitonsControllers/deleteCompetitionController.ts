import type {Context} from "hono";
import { competitionsService } from "../../services/competitionsServices/competitionService.js";

export default async function deleteCompetitionController(c: Context) {
    const { name } = c.req.query();
    
    try {
        const service = await competitionsService.deleteCompetition(name);

        if(!service.success) {
            return c.json({ success: false, message: service.message });
        }

        return c.json({ success: true, message: service.message });
    } catch (e: any) {
        console.error(e);
        return c.json({ success: false, message: 'Невідома помилка' });
    }
}