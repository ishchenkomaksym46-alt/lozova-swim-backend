/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "distances" DROP CONSTRAINT "distances_competition_id_fkey";

-- DropForeignKey
ALTER TABLE "heats" DROP CONSTRAINT "heats_distance_id_fkey";

-- DropForeignKey
ALTER TABLE "participants" DROP CONSTRAINT "participants_heat_id_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_distance_id_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_heat_id_fkey";

-- DropForeignKey
ALTER TABLE "results" DROP CONSTRAINT "results_participant_id_fkey";

-- DropTable
DROP TABLE "users";

-- AddForeignKey
ALTER TABLE "distances" ADD CONSTRAINT "distances_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heats" ADD CONSTRAINT "heats_distance_id_fkey" FOREIGN KEY ("distance_id") REFERENCES "distances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_heat_id_fkey" FOREIGN KEY ("heat_id") REFERENCES "heats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_distance_id_fkey" FOREIGN KEY ("distance_id") REFERENCES "distances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_heat_id_fkey" FOREIGN KEY ("heat_id") REFERENCES "heats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
