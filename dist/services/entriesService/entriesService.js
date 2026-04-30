import { prisma } from "../../src/lib/prisma.js";
function validateTimeFormat(time) {
    const timeRegex = /^\d{1,2}:[0-5]\d\.\d{2}$/;
    return timeRegex.test(time);
}
export const entriesService = {
    async createEntry(competitionId, name) {
        try {
            const entry = await prisma.entries.create({
                data: {
                    competitionId,
                    name
                }
            });
            return { success: true, data: { id: entry.id } };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при створенні заявки" };
        }
    },
    async getEntries(competitionId) {
        try {
            const entries = await prisma.entries.findMany({
                where: { competitionId },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    _count: {
                        select: { entryItems: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return { success: true, data: entries };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при отриманні заявок" };
        }
    },
    async deleteEntry(id) {
        try {
            const entry = await prisma.entries.findUnique({
                where: { id }
            });
            if (!entry) {
                return { success: false, message: "Заявку не знайдено" };
            }
            await prisma.entries.delete({
                where: { id }
            });
            return { success: true };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при видаленні заявки" };
        }
    },
    async addEntryItem(entryId, name, surname, birthYear, distanceId, seedTime) {
        try {
            if (!validateTimeFormat(seedTime)) {
                return { success: false, message: `Неправильний формат часу. Використовуйте формат мм:сс.мс` };
            }
            // Отримуємо competitionId з entry
            const entry = await prisma.entries.findUnique({
                where: { id: entryId },
                select: { competitionId: true }
            });
            if (!entry) {
                return { success: false, message: "Заявку не знайдено" };
            }
            // Створюємо entry item
            await prisma.entryItems.create({
                data: {
                    entryId,
                    name,
                    surname,
                    birthYear,
                    distanceId,
                    seedTime
                }
            });
            // Автоматично додаємо спортсмена до таблиці Swimmers (якщо його ще немає)
            const existingSwimmer = await prisma.swimmers.findFirst({
                where: {
                    name,
                    surname,
                    birthYear,
                    competitionId: entry.competitionId
                }
            });
            if (!existingSwimmer) {
                await prisma.swimmers.create({
                    data: {
                        name,
                        surname,
                        birthYear,
                        competitionId: entry.competitionId
                    }
                });
            }
            return { success: true };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при додаванні учасника" };
        }
    },
    async getEntryDetails(entryId) {
        try {
            const entry = await prisma.entries.findUnique({
                where: { id: entryId },
                select: {
                    id: true,
                    name: true,
                    competitionId: true,
                    createdAt: true
                }
            });
            if (!entry) {
                return { success: false, message: "Заявку не знайдено" };
            }
            return { success: true, data: entry };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при отриманні деталей заявки" };
        }
    },
    async getEntryItems(entryId) {
        try {
            const items = await prisma.entryItems.findMany({
                where: { entryId },
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    birthYear: true,
                    seedTime: true,
                    distance: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            return { success: true, data: items };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при отриманні учасників" };
        }
    },
    async deleteEntryItem(id) {
        try {
            const item = await prisma.entryItems.findUnique({
                where: { id }
            });
            if (!item) {
                return { success: false, message: "Учасника не знайдено" };
            }
            await prisma.entryItems.delete({
                where: { id }
            });
            return { success: true };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при видаленні учасника" };
        }
    },
    async getEntryProtocol(distanceId) {
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
            const entryItems = await prisma.entryItems.findMany({
                where: { distanceId },
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    birthYear: true,
                    seedTime: true,
                    entry: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: [
                    { birthYear: 'desc' },
                    { seedTime: 'asc' }
                ]
            });
            // Розраховуємо вікову групу для кожного учасника
            const competitionYear = new Date(distance.competition.date).getFullYear();
            const ageGroupsArray = distance.competition.ageGroups.split(',');
            const itemsWithAgeGroup = entryItems.map(item => {
                const age = competitionYear - item.birthYear;
                let ageGroup = "Без групи";
                for (const group of ageGroupsArray) {
                    if (group.includes('молодше')) {
                        const maxAge = parseInt(group.match(/\d+/)?.[0] || '10');
                        if (age <= maxAge) {
                            ageGroup = group;
                            break;
                        }
                    }
                    else if (group.includes('-')) {
                        const [min, max] = group.match(/\d+/g)?.map(Number) || [];
                        if (min && max && age >= min && age <= max) {
                            ageGroup = group;
                            break;
                        }
                    }
                    else if (group.includes('+')) {
                        const minAge = parseInt(group.match(/\d+/)?.[0] || '19');
                        if (age >= minAge) {
                            ageGroup = group;
                            break;
                        }
                    }
                }
                return { ...item, ageGroup };
            });
            return {
                success: true,
                data: {
                    distance,
                    items: itemsWithAgeGroup
                }
            };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при отриманні заявочного протоколу" };
        }
    }
};
