/*
  Warnings:

  - You are about to drop the column `birth_year` on the `entries` table. All the data in the column will be lost.
  - You are about to drop the column `distance_id` on the `entries` table. All the data in the column will be lost.
  - You are about to drop the column `seed_time` on the `entries` table. All the data in the column will be lost.
  - You are about to drop the column `surname` on the `entries` table. All the data in the column will be lost.
  - Added the required column `competition_id` to the `entries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "entries" DROP CONSTRAINT "entries_distance_id_fkey";

-- AlterTable
ALTER TABLE "entries" DROP COLUMN "birth_year",
DROP COLUMN "distance_id",
DROP COLUMN "seed_time",
DROP COLUMN "surname",
ADD COLUMN     "competition_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "entry_items" (
    "id" SERIAL NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birth_year" INTEGER NOT NULL,
    "distance_id" INTEGER NOT NULL,
    "seed_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entry_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_items" ADD CONSTRAINT "entry_items_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_items" ADD CONSTRAINT "entry_items_distance_id_fkey" FOREIGN KEY ("distance_id") REFERENCES "distances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
