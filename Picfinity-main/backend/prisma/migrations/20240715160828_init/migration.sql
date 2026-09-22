/*
  Warnings:

  - You are about to drop the column `saved` on the `Photo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "saved";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "saved" INTEGER[];
