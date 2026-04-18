import {prisma} from "../../src/lib/prisma.js";

export const heatsService = {
    async getHeats(id: number) {
        try {
            const heats = await prisma.heats.findMany({
                where: { distanceId: id },
                select: {
                    id: true,
                    heatNumber: true,
                    participants: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            declaredTime: true,
                            actualTime: true,
                            lane: true
                        }
                    }
                }
            });

            return { success: true, data: heats };
        } catch (e) {
            return { success: false };
        }
    },

    async createHeat(id: number, heatNumber: number, participants: Array<{ name: string, surname: string, declared_time: string, lane: number }>) {
        try {
            await prisma.$transaction(async tx => {
                const heat = await tx.heats.create({
                    data: {
                        heatNumber,
                        distanceId: Number(id)
                    },
                    select: {
                        id: true
                    }
                });

                for (const participant of participants) {
                    await tx.participants.create({
                        data: {
                            name: participant.name,
                            surname: participant.surname,
                            heatId: heat.id,
                            declaredTime: participant.declared_time,
                            lane: participant.lane
                        }
                    });
                }
            });

            return { success: true };
        } catch (e) {
            console.error(e);
            return { success: false, message: "Невідома помилка" };
        }
    },

    async deleteHeat(id: number) {
        try {
            await prisma.heats.delete({
                where: { id }
            });

            return { success: true };
        } catch (e) {
            return { success: false, message: "Невідома помилка" };
        }
    }
}