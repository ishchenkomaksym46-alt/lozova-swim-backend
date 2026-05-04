/*
  Warnings:

  - A unique constraint covering the columns `[header]` on the table `protocols` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "protocols_header_key" ON "protocols"("header");
