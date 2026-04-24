import {prisma} from "../../src/lib/prisma.js";

function validateTimeFormat(time: string): boolean {
    const timeRegex = /^\d{1,2}:[0-5]\d\.\d{2}$/;
    return timeRegex.test(time);
}

function timeToSeconds(time: string): number {
    const [minutes, rest] = time.split(':');
    const [seconds, milliseconds] = rest.split('.');
    return parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 100;
}

async function recalculatePlaces(distanceId: number) {
    // Получаем все результаты по дистанции
    const results = await prisma.results.findMany({
        where: { distanceId },
        select: {
            id: true,
            time: true,
            heatId: true
        }
    });

    // Сортируем по времени для общего места
    const sortedResults = results.sort((a, b) => {
        return timeToSeconds(a.time) - timeToSeconds(b.time);
    });

    // Обновляем общие места
    for (let i = 0; i < sortedResults.length; i++) {
        await prisma.results.update({
            where: { id: sortedResults[i].id },
            data: { place: i + 1 }
        });
    }

    // Получаем уникальные ID заплывов
    const heatIds = [...new Set(results.map(r => r.heatId))];

    // Для каждого заплыва рассчитываем места
    for (const heatId of heatIds) {
        const heatResults = results.filter(r => r.heatId === heatId);
        const sortedHeatResults = heatResults.sort((a, b) => {
            return timeToSeconds(a.time) - timeToSeconds(b.time);
        });

        for (let i = 0; i < sortedHeatResults.length; i++) {
            await prisma.results.update({
                where: { id: sortedHeatResults[i].id },
                data: { placeInHeat: i + 1 }
            });
        }
    }
}

export const resultsService = {
    async addResult(participantId: number, time: string) {
        try {
            if (!validateTimeFormat(time)) {
                return { success: false, message: "Неправильний формат часу. Використовуйте формат мм:сс.мс" };
            }

            const participant = await prisma.participants.findUnique({
                where: { id: participantId },
                select: {
                    heatId: true,
                    heat: {
                        select: {
                            distanceId: true
                        }
                    }
                }
            });

            if (!participant) {
                return { success: false, message: "Учасника не знайдено" };
            }

            const existingResult = await prisma.results.findFirst({
                where: { participantId }
            });

            if (existingResult) {
                await prisma.results.update({
                    where: { id: existingResult.id },
                    data: { time }
                });
            } else {
                await prisma.results.create({
                    data: {
                        participantId,
                        time,
                        heatId: participant.heatId,
                        distanceId: participant.heat.distanceId,
                        place: 999,
                        placeInHeat: 999
                    }
                });
            }

            await prisma.participants.update({
                where: { id: participantId },
                data: { actualTime: time }
            });

            await recalculatePlaces(participant.heat.distanceId);

            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при додаванні результату" };
        }
    },

    async getResults(distanceId: number) {
        try {
            const results = await prisma.results.findMany({
                where: { distanceId },
                select: {
                    id: true,
                    time: true,
                    place: true,
                    placeInHeat: true,
                    participant: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            declaredTime: true,
                            lane: true,
                            heat: {
                                select: {
                                    heatNumber: true
                                }
                            }
                        }
                    }
                },
                orderBy: { place: 'asc' }
            });

            return { success: true, data: results };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при отриманні результатів" };
        }
    }
}
