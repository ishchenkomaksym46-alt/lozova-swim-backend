import { competitionsService } from '../../services/competitionsServices/competitionService.js';
export default async function deleteCompetitionController(c) {
    const { name } = c.req.query();
    try {
        const service = await competitionsService.deleteCompetition(name);
        if (!service.success) {
            return c.json({ success: false, message: service.message });
        }
        return c.json({ success: true, message: service.message });
    }
    catch (e) {
        console.error(e);
        return c.json({ success: false, message: 'Невідома помилка' });
    }
}
