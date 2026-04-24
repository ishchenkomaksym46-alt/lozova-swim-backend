/*
  Warnings:

  - Added the required column `competition_id` to the `swimmers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "swimmers" ADD COLUMN     "competition_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "swimmers" ADD CONSTRAINT "swimmers_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
