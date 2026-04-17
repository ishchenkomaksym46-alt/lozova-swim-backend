/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `competitions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "competitions_name_key" ON "competitions"("name");
