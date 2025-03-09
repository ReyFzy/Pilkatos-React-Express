/*
  Warnings:

  - You are about to drop the `program` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `program` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `program` DROP FOREIGN KEY `Program_candidateId_fkey`;

-- AlterTable
ALTER TABLE `candidate` ADD COLUMN `banner` VARCHAR(191) NULL,
    ADD COLUMN `program` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `profilePic` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `program`;
