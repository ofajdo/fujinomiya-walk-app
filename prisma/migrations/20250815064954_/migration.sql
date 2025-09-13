/*
  Warnings:

  - Added the required column `display` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Route" ADD COLUMN     "display" BOOLEAN NOT NULL;
