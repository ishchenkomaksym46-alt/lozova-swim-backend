-- CreateTable
CREATE TABLE "swimmers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,

    CONSTRAINT "swimmers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "swimmers" ADD CONSTRAINT "swimmers_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
