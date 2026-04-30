import { competitionsService } from '../../services/competitionsServices/competitionService.js';
export default async function competitionControllers(c) {
    try {
        const service = await competitionsService.getCompetitions();
        if (!service.success) {
            return c.json({ success: false, message: service.message });
        }
        else {
            return c.json({ success: true, data: service.data });
        }
    }
    catch (error) {
        console.error(error);
        return c.json({ success: false, message: 'Невідома помилка' });
    }
}
