import { heatsService } from '../../services/heatsServices/heatsService.js';
export default async function deleteHeatController(c) {
    const { heatNumber, distanceId } = c.req.query();
    if (!heatNumber || !distanceId) {
        return c.json({ success: false, message: "Недостатньо данних" });
    }
    try {
        const heat = Number(heatNumber);
        const distance = Number(distanceId);
        if (isNaN(heat) || isNaN(distance)) {
            return c.json({ success: false, message: "Невірний формат даних" }, 400);
        }
        const service = await heatsService.deleteHeat(heat, distance);
        if (service.success) {
            return c.json({ success: true }, 200);
        }
        else {
            return c.json({ success: false, message: service.message });
        }
    }
    catch (e) {
        return c.json({ success: false, message: "Невідома помилка" }, 500);
    }
}
