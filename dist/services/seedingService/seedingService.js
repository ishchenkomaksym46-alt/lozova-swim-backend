import { prisma } from "../../src/lib/prisma.js";
import { distributeLanes } from "../heatsServices/laneDistributionService.js";
// Функція для парсингу часу в секунди
function parseTime(time) {
    const parts = time.split(':');
    if (parts.length === 2) {
        const minutes = parseInt(parts[0]);
        const secondsAndMs = parts[1].split('.');
        const seconds = parseInt(secondsAndMs[0]);
        const milliseconds = secondsAndMs[1] ? parseInt(secondsAndMs[1]) / 100 : 0;
        return minutes * 60 + seconds + milliseconds;
    }
    return parseFloat(time);
}
// Функція для визначення вікової групи за роком народження
function calculateAgeGroup(birthYear, competitionYear, ageGroupsArray) {
    for (const group of ageGroupsArray) {
        // Перевіряємо групи типу "2012" (один рік народження)
        if (/^\d{4}$/.test(group.trim())) {
            const year = parseInt(group.trim());
            if (birthYear === year) {
                return group;
            }
        }
        // Перевіряємо групи типу "2016-2017" (діапазон років народження)
        else if (group.includes('-') && !group.includes('старше') && !group.includes('молодше')) {
            const years = group.match(/\d+/g)?.map(Number) || [];
            if (years.length === 2) {
                const [year1, year2] = years;
                const minYear = Math.min(year1, year2);
                const maxYear = Math.max(year1, year2);
                if (birthYear >= minYear && birthYear <= maxYear) {
                    return group;
                }
            }
        }
        // Перевіряємо групи типу "2007 і старше" (рік народження і старше)
        else if (group.includes('старше')) {
            const year = parseInt(group.match(/\d+/)?.[0] || '0');
            if (year > 0 && birthYear <= year) {
                return group;
            }
        }
        // Перевіряємо групи типу "2020 і молодше" (рік народження і молодше)
        else if (group.includes('молодше')) {
            const year = parseInt(group.match(/\d+/)?.[0] || '0');
            if (year > 0 && birthYear >= year) {
                return group;
            }
        }
        // Перевіряємо старий формат вікових груп (на випадок сумісності)
        else if (group.includes('-')) {
            const age = competitionYear - birthYear;
            const [min, max] = group.match(/\d+/g)?.map(Number) || [];
            if (min && max && age >= min && age <= max) {
                return group;
            }
        }
        // Перевіряємо старий формат типу "19+" (вік)
        else if (group.includes('+')) {
            const age = competitionYear - birthYear;
            const minAge = parseInt(group.match(/\d+/)?.[0] || '19');
            if (age >= minAge) {
                return group;
            }
        }
    }
    return "Без групи";
}
export const seedingService = {
    async generateHeatsFromEntry(entryId) {
        try {
            // Отримуємо заявку та змагання
            const entry = await prisma.entries.findUnique({
                where: { id: entryId },
                select: {
                    id: true,
                    name: true,
                    competition: {
                        select: {
                            id: true,
                            date: true,
                            laneCount: true,
                            ageGroups: true
                        }
                    },
                    entryItems: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            birthYear: true,
                            seedTime: true,
                            distanceId: true
                        }
                    }
                }
            });
            if (!entry) {
                return { success: false, message: "Заявку не знайдено" };
            }
            if (entry.entryItems.length === 0) {
                return { success: false, message: "У заявці немає учасників" };
            }
            const laneCount = entry.competition.laneCount;
            const competitionYear = new Date(entry.competition.date).getFullYear();
            const ageGroupsArray = entry.competition.ageGroups.split(',');
            // Групуємо учасників за дистанціями
            const itemsByDistance = entry.entryItems.reduce((acc, item) => {
                if (!acc[item.distanceId]) {
                    acc[item.distanceId] = [];
                }
                acc[item.distanceId].push(item);
                return acc;
            }, {});
            let totalHeatsCreated = 0;
            const allCreatedHeats = [];
            // Обробляємо кожну дистанцію окремо
            for (const distanceIdStr in itemsByDistance) {
                const distanceId = Number(distanceIdStr);
                const entryItems = itemsByDistance[distanceId];
                // Перевіряємо чи існує дистанція
                const distance = await prisma.distances.findUnique({
                    where: { id: distanceId },
                    select: { id: true, name: true }
                });
                if (!distance) {
                    continue; // Пропускаємо видалені дистанції
                }
                // Перевіряємо чи вже є заплави для цієї дистанції
                const existingHeats = await prisma.heats.findMany({
                    where: { distanceId }
                });
                if (existingHeats.length > 0) {
                    continue; // Пропускаємо дистанції з існуючими заплавами
                }
                // Додаємо вікову групу до кожного учасника
                const itemsWithAgeGroup = entryItems.map(item => ({
                    ...item,
                    ageGroup: calculateAgeGroup(item.birthYear, competitionYear, ageGroupsArray)
                }));
                // Групуємо учасників за віковими групами
                const groupedByAge = itemsWithAgeGroup.reduce((acc, item) => {
                    const group = item.ageGroup;
                    if (!acc[group]) {
                        acc[group] = [];
                    }
                    acc[group].push(item);
                    return acc;
                }, {});
                // Сортуємо кожну групу: спочатку за роком народження (молодші першими), потім за часом
                for (const group in groupedByAge) {
                    groupedByAge[group].sort((a, b) => {
                        // Спочатка сортуємо за роком народження (від більшого до меншого = молодші першими)
                        if (b.birthYear !== a.birthYear) {
                            return b.birthYear - a.birthYear;
                        }
                        // Потім за часом (швидші першими)
                        return parseTime(a.seedTime) - parseTime(b.seedTime);
                    });
                }
                // Функція для отримання мінімального року народження з групи
                function getMinBirthYearFromGroup(groupName) {
                    // Для груп типу "2016 і молодше" - повертаємо найбільший рік (наймолодші)
                    if (groupName.includes('молодше')) {
                        const year = parseInt(groupName.match(/\d+/)?.[0] || '9999');
                        return year;
                    }
                    // Для груп типу "2007 і старше" - повертаємо найменший рік (найстарші)
                    else if (groupName.includes('старше')) {
                        const year = parseInt(groupName.match(/\d+/)?.[0] || '0');
                        return year;
                    }
                    // Для груп типу "2016-2017" - повертаємо максимальний рік (наймолодші в діапазоні)
                    else if (groupName.includes('-')) {
                        const years = groupName.match(/\d+/g)?.map(Number) || [0];
                        return Math.max(...years);
                    }
                    // Для груп типу "2012" - повертаємо цей рік
                    else if (/^\d{4}$/.test(groupName.trim())) {
                        return parseInt(groupName.trim());
                    }
                    return 0;
                }
                // Сортуємо групи за віком: від молодших до старших
                const sortedGroups = Object.keys(groupedByAge).sort((a, b) => {
                    const yearA = getMinBirthYearFromGroup(a);
                    const yearB = getMinBirthYearFromGroup(b);
                    // Більший рік = молодші = мають бути першими
                    return yearB - yearA;
                });
                let heatNumber = 1;
                const createdHeats = [];
                // Створюємо заплави для кожної вікової групи (від молодших до старших)
                for (const group of sortedGroups) {
                    const participants = groupedByAge[group];
                    // Розбиваємо учасників на заплави
                    for (let i = 0; i < participants.length; i += laneCount) {
                        const heatParticipants = participants.slice(i, i + laneCount);
                        // Розподіляємо доріжки
                        const lanes = distributeLanes(heatParticipants.map(p => ({ declared_time: p.seedTime })), laneCount);
                        // Створюємо заплив
                        await prisma.heats.create({
                            data: {
                                heatNumber,
                                distanceId,
                                participants: {
                                    createMany: {
                                        data: heatParticipants.map((participant, idx) => ({
                                            name: participant.name,
                                            surname: participant.surname,
                                            birthYear: participant.birthYear,
                                            declaredTime: participant.seedTime,
                                            lane: lanes[idx]
                                        }))
                                    }
                                }
                            }
                        });
                        createdHeats.push({
                            heatNumber,
                            ageGroup: group,
                            participantCount: heatParticipants.length,
                            distanceName: distance.name
                        });
                        heatNumber++;
                    }
                }
                totalHeatsCreated += createdHeats.length;
                allCreatedHeats.push(...createdHeats);
            }
            if (totalHeatsCreated === 0) {
                return { success: false, message: "Не вдалося створити заплави. Можливо, для всіх дистанцій вже існують заплави." };
            }
            return {
                success: true,
                message: `Створено ${totalHeatsCreated} заплавів для ${Object.keys(itemsByDistance).length} дистанцій`,
                data: allCreatedHeats
            };
        }
        catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при формуванні заплавів" };
        }
    }
};
