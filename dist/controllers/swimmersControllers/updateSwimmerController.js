import { swimmersService } from '../../services/swimmersService/swimmersServices.js';
export default async function updateSwimmerController(c) {
    const { id, name, surname, birthYear } = await c.req.json();
    if (!id) {
        return c.json({ success: false, message: "ID учасника не надано" }, 400);
    }
    const swimmerId = Number(id);
    if (isNaN(swimmerId)) {
        return c.json({ success: false, message: "Невірний ID учасника" }, 400);
    }
    const updateData = {};
    if (name)
        updateData.name = name;
    if (surname)
        updateData.surname = surname;
    if (birthYear) {
        const year = Number(birthYear);
        if (isNaN(year)) {
            return c.json({ success: false, message: "Невірний формат року народження" }, 400);
        }
        updateData.birthYear = year;
    }
    if (Object.keys(updateData).length === 0) {
        return c.json({ success: false, message: "Немає даних для оновлення" }, 400);
    }
    try {
        const service = await swimmersService.updateSwimmer(swimmerId, updateData);
        if (service.success) {
            return c.json({ success: true, message: "Учасника оновлено" });
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
