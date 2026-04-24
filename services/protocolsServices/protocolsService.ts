import {prisma} from "../../src/lib/prisma.js";

export const protocolsService = {
    async uploadProtocol(competitionId: number, textContent: string) {
        try {
            const existingProtocol = await prisma.protocols.findFirst({
                where: { competitionId }
            });

            if (existingProtocol) {
                await prisma.protocols.update({
                    where: { id: existingProtocol.id },
                    data: { textContent }
                });
            } else {
                await prisma.protocols.create({
                    data: {
                        competitionId,
                        textContent
                    }
                });
            }

            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при завантаженні протоколу" };
        }
    },

    async getProtocol(competitionId: number) {
        try {
            const protocol = await prisma.protocols.findFirst({
                where: { competitionId },
                select: {
                    id: true,
                    textContent: true,
                    fileName: true,
                    fileUrl: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!protocol) {
                return { success: false, message: "Протокол не знайдено" };
            }

            return { success: true, data: protocol };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка при отриманні протоколу" };
        }
    }
}
