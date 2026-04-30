import { resultsService } from '../../services/resultsServices/resultsService.js';
export default async function getResultsController(c) {
    const { id } = c.req.query();
    if (!id) {
        return c.json({ success: false, message: "ID дистанції не надано" }, 400);
    }
    const distanceId = Number(id);
    if (isNaN(distanceId)) {
        return c.json({ success: false, message: "Невірний ID дистанції" }, 400);
    }
    try {
        const service = await resultsService.getResults(distanceId);
        if (service.success) {
            return c.json({ success: true, data: service.data }, 200);
        }
        else {
            return c.json({ success: false, message: service.message });
        }
    }
    catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Помилка сервера" }, 500);
    }
}
