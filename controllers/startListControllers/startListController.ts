import type {Context} from "hono";
import {prisma} from "../../src/lib/prisma.js";

export default async function startListController(c: Context) {
    const { id } = c.req.query();

    const distanceId = Number(id);

    if (!id || isNaN(distanceId)) {
        return c.json({ success: false, message: "Невірний ID дистанції" }, 400);
    }

    try {
        const distance = await prisma.distances.findUnique({
            where: { id: distanceId },
            select: {
                id: true,
                name: true,
                competition: {
                    select: {
                        name: true,
                        date: true,
                        laneCount: true
                    }
                }
            }
        });

        if (!distance) {
            return c.json({ success: false, message: "Дистанцію не знайдено" }, 404);
        }

        const heats = await prisma.heats.findMany({
            where: { distanceId },
            select: {
                id: true,
                heatNumber: true,
                participants: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        birthYear: true,
                        declaredTime: true,
                        lane: true
                    },
                    orderBy: {
                        lane: 'asc'
                    }
                }
            },
            orderBy: {
                heatNumber: 'asc'
            }
        });

        return c.json({
            success: true,
            data: {
                distance,
                heats
            }
        });
    } catch (e) {
        console.error(e);
        return c.json({ success: false, message: "Невідома помилка" }, 500);
    }
}
