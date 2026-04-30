import { prisma } from '../../src/lib/prisma.js';
export const swimmersService = {
    async getSwimmers(competitionId, page) {
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
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
        }
        catch (e) {
            return { success: false, message: "Помилка сервісу" };
        }
    },
    async createSwimmer(name, surname, birthYear, competitionId) {
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
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при створенні учасника" };
        }
    },
    async updateSwimmer(id, data) {
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
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при оновленні учасника" };
        }
    },
    async deleteSwimmer(id) {
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
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при видаленні учасника" };
        }
    },
    async getSwimmerDetails(swimmerId, competitionId) {
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
                                    name: true,
                                    competitionId: true
                                }
                            }
                        }
                    },
                    results: {
                        select: {
                            time: true,
                            place: true,
                            placeInHeat: true
                        }
                    }
                },
                orderBy: [
                    { heat: { distance: { name: 'asc' } } },
                    { heat: { heatNumber: 'asc' } }
                ]
            });
            // Filter participations to only include those from the selected competition
            const filteredParticipations = participations.filter(p => p.heat.distance.competitionId === competitionId);
            return {
                success: true,
                swimmer: {
                    ...swimmer,
                    participations: filteredParticipations
                }
            };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при отриманні даних учасника" };
        }
    }
};
