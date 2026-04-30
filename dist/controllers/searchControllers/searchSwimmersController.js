import { searchService } from '../../services/searchService/searchService.js';
export default async function searchSwimmersController(c) {
    const { competitionId, page = 1, searchSurname } = c.req.query();
    const compId = Number(competitionId);
    const pageNum = Number(page);
    if (isNaN(compId) || isNaN(pageNum)) {
        return c.json({ message: "Невірний формат даних" }, 400);
    }
    if (pageNum < 1) {
        return c.json({ message: "Номер сторінки повинен бути більше 0" }, 400);
    }
    try {
        const service = await searchService.searchSwimmers(compId, pageNum, searchSurname);
        if (!service) {
            return c.json({ message: "Сервіс не знайдено" }, 500);
        }
        if (service.success) {
            return c.json({ swimmers: service.swimmers }, 200);
        }
        else {
            return c.json({ message: service.message });
        }
    }
    catch (e) {
        console.error(e);
        return c.json({ message: "Помилка сервера" }, 500);
    }
}
