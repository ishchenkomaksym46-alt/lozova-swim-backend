import {prisma} from "../../src/lib/prisma.js";

export const swimmersService = {
    async getSwimmers(competitionId: number, page: number) {
        try {
            const limit = 10;
            const offset = ( page - 1 ) * limit;
            const swimmers = await prisma.swimmers.findMany({
                where: { competitionId },
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    birthYear: true,
                },
                take: limit,
                skip: offset,
            });

            return { success: true, swimmers: swimmers };
        } catch (e) {
            return { success: false, message: "Помилка сервісу" };
        }
    },

    async createSwimmer(name: string, surname: string, birthYear: number, competitionId: number) {
        try {
            await prisma.swimmers.create({
                data: {
                    name,
                    surname,
                    birthYear,
                    competitionId
                }
            });

            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при створенні учасника" };
        }
    },

    async updateSwimmer(id: number, data: { name?: string; surname?: string; birthYear?: number }) {
        try {
            const swimmer = await prisma.swimmers.findUnique({
                where: { id }
            });

            if (!swimmer) {
                return { success: false, message: "Учасника не знайдено" };
            }

            await prisma.swimmers.update({
                where: { id },
                data
            });

            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при оновленні учасника" };
        }
    },

    async deleteSwimmer(id: number) {
        try {
            const swimmer = await prisma.swimmers.findUnique({
                where: { id }
            });

            if (!swimmer) {
                return { success: false, message: "Учасника не знайдено" };
            }

            await prisma.swimmers.delete({
                where: { id }
            });

            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при видаленні учасника" };
        }
    },

    async getSwimmerDetails(swimmerId: number, competitionId: number) {
        try {
            const swimmer = await prisma.swimmers.findFirst({
                where: {
                    id: swimmerId,
                    competitionId
                },
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    birthYear: true,
                }
            });

            if (!swimmer) {
                return { success: false, message: "Учасника не знайдено" };
            }

            const participations = await prisma.participants.findMany({
                where: {
                    name: swimmer.name,
                    surname: swimmer.surname
                },
                select: {
                    id: true,
                    declaredTime: true,
                    actualTime: true,
                    lane: true,
                    heat: {
                        select: {
                            heatNumber: true,
                            distance: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
                orderBy: [
                    { heat: { distance: { name: 'asc' } } },
                    { heat: { heatNumber: 'asc' } }
                ]
            });

            return {
                success: true,
                swimmer: {
                    ...swimmer,
                    participations
                }
            };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при отриманні даних учасника" };
        }
    }
}