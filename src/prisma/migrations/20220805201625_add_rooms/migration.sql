-- CreateTable
CREATE TABLE `Room` (
    `name` VARCHAR(191) NOT NULL,
    `liveblocksId` VARCHAR(191) NOT NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Room_liveblocksId_key`(`liveblocksId`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoomToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_RoomToUser_AB_unique`(`A`, `B`),
    INDEX `_RoomToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
