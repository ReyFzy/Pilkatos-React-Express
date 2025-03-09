/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Ketua` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Wakil` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Ketua_userId_key` ON `Ketua`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Wakil_userId_key` ON `Wakil`(`userId`);
