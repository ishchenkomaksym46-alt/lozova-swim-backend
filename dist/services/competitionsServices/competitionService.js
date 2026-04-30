import { prisma } from '../../src/lib/prisma.js';
export const competitionsService = {
    async getCompetitions() {
        try {
            const competitions = await prisma.competition.findMany({
                select: {
                    id: true,
                    name: true,
                    date: true,
                    laneCount: true,
                    distances: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                take: 3,
                orderBy: {
                    id: "desc"
                }
            });
            return { success: true, data: competitions };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: 'Невідома помилка' };
        }
    },
    async createCompetition(name, date, laneCount = 6, ageGroups = "10 і молодше,11-12,13-14,15-16,17-18,19+") {
        try {
            await prisma.competition.create({
                data: {
                    name,
                    date,
                    laneCount,
                    ageGroups
                }
            });
            return { success: true };
        }
        catch (e) {
            return { success: false, message: "Невідома помилка" };
        }
    },
    async deleteCompetition(name) {
        try {
            await prisma.competition.delete({
                where: { name: name }
            });
            return { success: true, message: "Змагання успішно видалено!" };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка сервера" };
        }
    },
    async updateCompetition(oldName, name, date) {
        try {
            await prisma.competition.update({
                where: { name: oldName },
                data: {
                    name,
                    date
                }
            });
            return { success: true, message: "Змагання успішно оновлено!" };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Проблема сервера" };
        }
    }
};
