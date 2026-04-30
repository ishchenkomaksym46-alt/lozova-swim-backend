import { prisma } from '../../src/lib/prisma.js';
export const searchService = {
    async searchSwimmers(competitionId, page, searchSurname) {
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const swimmers = await prisma.swimmers.findMany({
                where: {
                    competitionId,
                    surname: {
                        contains: searchSurname,
                        mode: "insensitive"
                    }
                },
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    birthYear: true
                },
                take: limit,
                skip: offset
            });
            return { success: true, swimmers };
        }
        catch (e) {
            return { success: false, message: "Проблема сервісу" };
        }
    }
};
