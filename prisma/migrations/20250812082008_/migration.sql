/*
  Warnings:

  - Made the column `startingPointId` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Course" DROP CONSTRAINT "Course_startingPointId_fkey";

-- AlterTable
ALTER TABLE "public"."Course" ALTER COLUMN "startingPointId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "referenceId" TEXT;

-- CreateTable
CREATE TABLE "public"."LocationCulture" (
    "locationId" TEXT NOT NULL,
    "cultureId" TEXT NOT NULL,

    CONSTRAINT "LocationCulture_pkey" PRIMARY KEY ("locationId","cultureId")
);

-- CreateTable
CREATE TABLE "public"."Culture" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Culture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_startingPointId_fkey" FOREIGN KEY ("startingPointId") REFERENCES "public"."StartingPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LocationCulture" ADD CONSTRAINT "LocationCulture_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LocationCulture" ADD CONSTRAINT "LocationCulture_cultureId_fkey" FOREIGN KEY ("cultureId") REFERENCES "public"."Culture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
