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

            //@ts-ignore
            await prisma.$transaction(async tx => {
                // Получаем количество дорожек из соревнования
                const distance = await tx.distances.findUnique({
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
                    throw new Error(`Кількість учасників (${participants.length}) перевищує кількість доріжок (${laneCount})`);
                }

                // Автоматически распределяем дорожки
                const lanes = distributeLanes(participants, laneCount);

                const heat = await tx.heats.create({
                    data: {
                        heatNumber,
                        distanceId: Number(id)
                    },
                    select: {
                        id: true
                    }
                });

                for (let i = 0; i < participants.length; i++) {
                    await tx.participants.create({
                        data: {
                            name: participants[i].name,
                            surname: participants[i].surname,
                            heatId: heat.id,
                            declaredTime: participants[i].declared_time,
                            lane: lanes[i]
                        }
                    });
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
            //@ts-ignore
            await prisma.$transaction(async tx => {
                const heat = await tx.heats.findFirst({
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

                await tx.heats.delete({
                    where: { id: heat.id }
                });
            })

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
            await prisma.$transaction(async tx => {
                // Найти заплыв
                const heat = await tx.heats.findFirst({
                    where: {
                        heatNumber: heatNumber,
                        distanceId: distanceId
                    }
                });

                if (!heat) {
                    throw new Error("Заплив не знайдено");
                }

                // Обновить номер заплыва, если указан
                if (newHeatNumber && newHeatNumber !== heatNumber) {
                    // Проверить, не занят ли новый номер
                    const existingHeat = await tx.heats.findFirst({
                        where: {
                            heatNumber: newHeatNumber,
                            distanceId: distanceId
                        }
                    });

                    if (existingHeat) {
                        throw new Error(`Заплив з номером ${newHeatNumber} вже існує`);
                    }

                    await tx.heats.update({
                        where: { id: heat.id },
                        data: { heatNumber: newHeatNumber }
                    });
                }

                // Обновить actual_time для участников
                if (participants && participants.length > 0) {
                    for (const participant of participants) {
                        // Валидация формата времени
                        if (participant.actualTime && participant.actualTime !== "Справжнього часу це нема") {
                            if (!validateTimeFormat(participant.actualTime)) {
                                throw new Error(`Неправильний формат часу. Використовуйте формат мм:сс.мс`);
                            }
                        }

                        await tx.participants.update({
                            where: { id: participant.id },
                            data: { actualTime: participant.actualTime }
                        });
                    }
                }
            });

            return { success: true };
        } catch (e: any) {
            console.error(e);
            return { success: false, message: e.message || "Невідома помилка" };
        }
    }
}