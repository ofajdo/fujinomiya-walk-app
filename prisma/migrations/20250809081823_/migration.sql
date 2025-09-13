/*
  Warnings:

  - Added the required column `name` to the `StartingPoint` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Course" DROP CONSTRAINT "Course_startingPointId_fkey";

-- AlterTable
ALTER TABLE "public"."Course" ALTER COLUMN "startingPointId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."StartingPoint" ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_startingPointId_fkey" FOREIGN KEY ("startingPointId") REFERENCES "public"."StartingPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
