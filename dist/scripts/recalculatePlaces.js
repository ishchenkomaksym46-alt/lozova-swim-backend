import { prisma } from "../src/lib/prisma.js";
function timeToSeconds(time) {
    const [minutes, rest] = time.split(':');
    const [seconds, milliseconds] = rest.split('.');
    return parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 100;
}
async function recalculateAllPlaces() {
    console.log('Починаємо перерахунок місць...');
    // Получаем все дистанции
    const distances = await prisma.distances.findMany({
        select: { id: true }
    });
    for (const distance of distances) {
        console.log(`Обробка дистанції ${distance.id}...`);
        // Получаем все результаты по дистанции
        const results = await prisma.results.findMany({
            where: { distanceId: distance.id },
            select: {
                id: true,
                time: true,
                heatId: true
            }
        });
        if (results.length === 0)
            continue;
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
        console.log(`Дистанція ${distance.id} оброблена`);
    }
    console.log('Перерахунок завершено!');
    await prisma.$disconnect();
}
recalculateAllPlaces().catch(console.error);
