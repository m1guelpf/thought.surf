-- CreateTable
CREATE TABLE `User` (
    `address` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `profile_picture_url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
