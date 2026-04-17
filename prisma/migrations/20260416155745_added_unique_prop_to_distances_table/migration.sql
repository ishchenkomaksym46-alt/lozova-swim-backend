/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `distances` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "distances_name_key" ON "distances"("name");
