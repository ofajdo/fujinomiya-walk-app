/*
  Warnings:

  - A unique constraint covering the columns `[qrId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "nextId" TEXT,
ALTER COLUMN "address" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Location_qrId_key" ON "public"."Location"("qrId");

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_nextId_fkey" FOREIGN KEY ("nextId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
