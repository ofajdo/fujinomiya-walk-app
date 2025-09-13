/*
  Warnings:

  - You are about to drop the column `latitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[startingPointId]` on the table `Route` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Location" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "public"."Route" ADD COLUMN     "sort" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "startingPointId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Route_startingPointId_key" ON "public"."Route"("startingPointId");

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_startingPointId_fkey" FOREIGN KEY ("startingPointId") REFERENCES "public"."StartingPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
