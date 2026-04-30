import type {Context} from "hono";
import {distancesServices} from "../../services/distancesServices/distancesServices.js";

export default async function getDistanceDetailsController(c: Context) {
    const { id } = c.req.query();

    if (!id) {
        return c.json({ success: false, message: "ID дистанції не вказано" }, 400);
    }

    const distanceId = Number(id);

    if (isNaN(distanceId)) {
        return c.json({ success: false, message: "Невірний ID дистанції" }, 400);
    }

    const result = await distancesServices.getDistanceDetails(distanceId);

    if (result.success) {
        return c.json({ success: true, data: result.data });
    } else {
        return c.json({ success: false, message: result.message }, 404);
    }
}
