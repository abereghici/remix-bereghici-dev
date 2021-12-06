-- CreateTable
CREATE TABLE `views` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(1024) NOT NULL,
    `count` BIGINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
