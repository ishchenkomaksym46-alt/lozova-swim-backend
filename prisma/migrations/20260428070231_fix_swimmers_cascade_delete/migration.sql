-- DropForeignKey
ALTER TABLE "swimmers" DROP CONSTRAINT "swimmers_competition_id_fkey";

-- AddForeignKey
ALTER TABLE "swimmers" ADD CONSTRAINT "swimmers_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
