/*
  Warnings:

  - Added the required column `imagePath` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isFeatured` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "imagePath" TEXT NOT NULL,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL;
