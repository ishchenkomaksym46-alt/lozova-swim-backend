import { entriesService } from "../../services/entriesService/entriesService.js";
export default async function updateEntryController(c) {
    const { id, name, surname, birthYear, seedTime } = await c.req.json();
    if (!id) {
        return c.json({ success: false, message: "ID заявки не вказано" }, 400);
    }
    const entryId = Number(id);
    if (isNaN(entryId)) {
        return c.json({ success: false, message: "Невірний ID заявки" }, 400);
    }
    const updateData = {};
    if (name)
        updateData.name = name;
    if (surname)
        updateData.surname = surname;
    if (birthYear)
        updateData.birthYear = Number(birthYear);
    if (seedTime)
        updateData.seedTime = seedTime;
    try {
        const service = await entriesService.updateEntry(entryId, updateData);
        if (service.success) {
            return c.json({ success: true, message: "Заявку оновлено" });
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
