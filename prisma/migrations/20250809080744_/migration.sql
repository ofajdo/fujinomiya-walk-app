/*
  Warnings:

  - Added the required column `startingPointId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "startingPointId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_startingPointId_fkey" FOREIGN KEY ("startingPointId") REFERENCES "public"."StartingPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
