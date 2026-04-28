import {prisma} from '../../src/lib/prisma.js';
import {distributeLanes} from './laneDistributionService.js';

function validateTimeFormat(time: string): boolean {
    // Формат мм:сс.мс (миллисекунды 00-99)
    const timeRegex = /^\d{1,2}:[0-5]\d\.\d{2}$/;
    return timeRegex.test(time);
}

export const heatsService = {
    async getHeats(id: number) {
        try {
            const heats = await prisma.heats.findMany({
                where: { distanceId: id },
                select: {
                    id: true,
                    heatNumber: true,
                    participants: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            declaredTime: true,
                            actualTime: true,
                            lane: true
                        },
                        orderBy: {
                            lane: 'asc'
                        }
                    }
                }
            });

            return { success: true, data: heats };
        } catch (e) {
            return { success: false };
        }
    },

    async createHeat(id: number, heatNumber: number, participants: Array<{ name: string, surname: string, declared_time: string }>) {
        try {
            // Валидация формата времени
            for (const participant of participants) {
                if (!validateTimeFormat(participant.declared_time)) {
                    return { success: false, message: `Неправильний формат часу для ${participant.name} ${participant.surname}. Використовуйте формат мм:сс.мс` };
                }
            }

            // Получаем количество дорожек из соревнования
            const distance = await prisma.distances.findUnique({
                where: { id: Number(id) },
                select: {
                    competition: {
                        select: {
                            laneCount: true
                        }
                    }
                }
            });

            const laneCount = distance?.competition.laneCount || 6;

            // Проверка количества участников
            if (participants.length > laneCount) {
                return { success: false, message: `Кількість учасників (${participants.length}) перевищує кількість доріжок (${laneCount})`};
            }

            // Автоматически распределяем дорожки
            const lanes = distributeLanes(participants, laneCount);

            // Создаем заплыв с участниками одним запросом
            await prisma.heats.create({
                data: {
                    heatNumber,
                    distanceId: Number(id),
                    participants: {
                        createMany: {
                            data: participants.map((participant, i) => ({
                                name: participant.name,
                                surname: participant.surname,
                                declaredTime: participant.declared_time,
                                lane: lanes[i]
                            }))
                        }
                    }
                }
            });

            return { success: true };
        } catch (e: any) {
            console.error(e);
            return { success: false, message: "Невідома помилка" };
        }
    },

    async deleteHeat(heatNumber: number, distanceId: number) {
        try {
            const heat = await prisma.heats.findFirst({
                where: {
                    heatNumber,
                    distanceId
                },
                select: {
                    id: true
                }
            });

            if(!heat) {
                return { success: false, message: "Заплив не знайдено" }
            }

            await prisma.heats.delete({
                where: { id: heat.id }
            });

            return { success: true };
        } catch (e) {
            return { success: false, message: "Невідома помилка" };
        }
    },

    async updateHeat(
        heatNumber: number,
        distanceId: number,
        newHeatNumber?: number,
        participants?: Array<{ id: number; actualTime: string }>
    ) {
        try {
            // Найти заплыв
            const heat = await prisma.heats.findFirst({
                where: {
                    heatNumber: heatNumber,
                    distanceId: distanceId
                }
            });

            if (!heat) {
                return { success: false, message: "Заплив не знайдено" };
            }

            // Обновить номер заплыва, если указан
            if (newHeatNumber && newHeatNumber !== heatNumber) {
                // Проверить, не занят ли новый номер
                const existingHeat = await prisma.heats.findFirst({
                    where: {
                        heatNumber: newHeatNumber,
                        distanceId: distanceId
                    }
                });

                if (existingHeat) {
                    return { success: false, message: `Заплив з номером ${newHeatNumber} вже існує` };
                }

                await prisma.heats.update({
                    where: { id: heat.id },
                    data: { heatNumber: newHeatNumber }
                });
            }

            // Обновить actual_time для участников
            if (participants && participants.length > 0) {
                // Валидация формата времени для всех участников
                for (const participant of participants) {
                    if (participant.actualTime && participant.actualTime !== "Справжнього часу це нема") {
                        if (!validateTimeFormat(participant.actualTime)) {
                            return { success: false, message: `Неправильний формат часу. Використовуйте формат мм:сс.мс` };
                        }
                    }
                }

                // Обновляем всех участников параллельно
                await Promise.all(
                    participants.map(participant =>
                        prisma.participants.update({
                            where: { id: participant.id },
                            data: { actualTime: participant.actualTime }
                        })
                    )
                );
            }

            return { success: true };
        } catch (e: any) {
            console.error(e);
            return { success: false, message: e.message || "Невідома помилка" };
        }
    }
}