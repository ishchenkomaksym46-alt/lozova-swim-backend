/*
  Warnings:

  - Added the required column `swimmer_id` to the `distances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "distances" ADD COLUMN     "swimmer_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "swimmers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birth_year" INTEGER NOT NULL,

    CONSTRAINT "swimmers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "distances" ADD CONSTRAINT "distances_swimmer_id_fkey" FOREIGN KEY ("swimmer_id") REFERENCES "swimmers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
