import { entriesService } from "../../services/entriesService/entriesService.js";
export default async function addEntryItemController(c) {
    const { entryId, name, surname, birthYear, distanceId, seedTime } = await c.req.json();
    if (!entryId || !name || !surname || !birthYear || !distanceId || !seedTime) {
        return c.json({ success: false, message: "Недостатньо даних" }, 400);
    }
    const year = Number(birthYear);
    const distId = Number(distanceId);
    const entId = Number(entryId);
    if (isNaN(year) || isNaN(distId) || isNaN(entId)) {
        return c.json({ success: false, message: "Невірний формат даних" }, 400);
    }
    try {
        const service = await entriesService.addEntryItem(entId, name, surname, year, distId, seedTime);
        if (service.success) {
            return c.json({ success: true, message: "Учасника додано" });
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
