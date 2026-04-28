import type {Context} from "hono";
import {entriesService} from "../../services/entriesService/entriesService.js";

export default async function getEntryItemsController(c: Context) {
    const { id } = c.req.query();

    const entryId = Number(id);

    if (!id || isNaN(entryId)) {
        return c.json({ success: false, message: "Невірний ID заявки" }, 400);
    }

    try {
        const service = await entriesService.getEntryItems(entryId);

        if (service.success) {
            return c.json({ success: true, data: service.data });
        } else {
            return c.json({ success: false, message: service.message });
        }
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Невідома помилка" }, 500);
    }
}
