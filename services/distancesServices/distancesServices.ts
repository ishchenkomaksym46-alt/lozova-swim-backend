import {prisma} from "../../src/lib/prisma.js";

export const distancesServices = {
    async getDistances(id: string) {
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
        } catch (e) {
            console.error(e);
            return { success: false, message: 'Помилка сервісу' };
        }
    },

    async createDistance(id: number, name: string) {
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
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка сервера" };
        }
    },

    async deleteDistance(name: string) {
        try {
            await prisma.distances.delete({
                where: { name }
            });

            return { success: true }
        } catch (e: any) {
            console.error(e);
            return { success: false, message: "Помилка сервера" }
        }
    },

    async updateDistance(oldName: string, name: string) {
        try {
            await prisma.distances.update({
                where: { name: oldName },
                data: {
                    name
                }
            });

            return { success: true }
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка сервера" };
        }
    }
}