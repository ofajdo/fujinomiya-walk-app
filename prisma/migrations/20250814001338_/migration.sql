/*
  Warnings:

  - You are about to drop the column `Latitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `Longitude` on the `Location` table. All the data in the column will be lost.
  - Made the column `latitude` on table `Location` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Location" DROP COLUMN "Latitude",
DROP COLUMN "Longitude",
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;
