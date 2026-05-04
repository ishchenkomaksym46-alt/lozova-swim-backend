import {prisma} from "../../src/lib/prisma.js";

export const protocolsService = {
    async getProtocols(competitionId: number, page: number) {
        try {
            const limit = 10;
            const offset = ( page - 1 ) * limit;

            const protocol = await prisma.protocols.findMany({
                where: { competitionId },
                select: {
                    header: true,
                    text: true,
                    createdAt: true,
                    updatedAt: true
                },
                take: limit,
                skip: offset
            });

            return { success: true, protocol };
        } catch (e) {
            return { success: false, message: "Невідома помилка" };
        }
    },

    async createProtocol(competitionId: number, header: string, text: string) {
        try {
            await prisma.protocols.create({
                data: {
                    competitionId,
                    header,
                    text
                }
            });

            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка сервісу" };
        }
    },

    async updateProtocol(oldHeader: string, newHeader: string, text: string) {
        try {
            await prisma.$transaction(async tx => {
                const res = await tx.protocols.findUnique({
                    where: { header: oldHeader },
                    select: {
                        id: true
                    }
                });

                if(!res) throw new Error("Protocol not found");

                await tx.protocols.update({
                    where: { id: res.id },
                    data: {
                        header: newHeader,
                        text
                    }
                })
            });

            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Помилка сервера" }
        }
    },

    async deleteProtocol(header: string) {
        try {
            await prisma.protocols.delete({
                where: { header }
            });

            return { success: true };
        } catch (e) {
            return { success: false, message: "Помилка серверу" };
        }
    }
}