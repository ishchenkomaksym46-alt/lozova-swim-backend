import { prisma } from '../../src/lib/prisma.js';
export const distancesServices = {
    async getDistances(id) {
        try {
            const distances = await prisma.distances.findMany({
                where: { competitionId: Number(id) },
                select: {
                    id: true,
                    name: true,
                    heats: {
                        select: { id: true }
                    }
                }
            });
            return { success: true, distances: distances };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: 'Помилка сервісу' };
        }
    },
    async createDistance(id, name) {
        try {
            await prisma.distances.create({
                select: {
                    id: true,
                    name: true
                },
                data: {
                    name,
                    competitionId: id,
                }
            });
            return { success: true };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка сервера" };
        }
    },
    async deleteDistance(name) {
        try {
            await prisma.distances.delete({
                where: { name }
            });
            return { success: true };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка сервера" };
        }
    },
    async updateDistance(oldName, name) {
        try {
            await prisma.distances.update({
                where: { name: oldName },
                data: {
                    name
                }
            });
            return { success: true };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка сервера" };
        }
    },
    async getLaneCount(distanceId) {
        try {
            const distance = await prisma.distances.findUnique({
                where: { id: distanceId },
                select: {
                    competition: {
                        select: {
                            laneCount: true
                        }
                    }
                }
            });
            return { success: true, laneCount: distance?.competition.laneCount || 6 };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка сервера" };
        }
    },
    async getDistanceDetails(distanceId) {
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
                            ageGroups: true
                        }
                    }
                }
            });
            if (!distance) {
                return { success: false, message: "Дистанцію не знайдено" };
            }
            return { success: true, data: distance };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка сервера" };
        }
    }
};
