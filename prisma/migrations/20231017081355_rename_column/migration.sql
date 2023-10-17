/*
  Warnings:

  - You are about to drop the column `Rank` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "Rank",
ADD COLUMN     "rank" INTEGER;
