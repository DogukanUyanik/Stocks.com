-- CreateTable
CREATE TABLE `gebruikers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `balans` DOUBLE NOT NULL DEFAULT 50000.00,
    `password_hash` VARCHAR(255) NOT NULL,
    `roles` JSON NOT NULL,

    UNIQUE INDEX `idx_user_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aandelen` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `afkorting` VARCHAR(191) NOT NULL,
    `naam` VARCHAR(191) NOT NULL,
    `prijs` INTEGER NOT NULL,
    `marktId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transacties` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `gebruikerId` INTEGER UNSIGNED NOT NULL,
    `aandeelId` INTEGER UNSIGNED NOT NULL,
    `hoeveelheid` INTEGER NOT NULL,
    `prijstransactie` DOUBLE NOT NULL,
    `soorttransactie` VARCHAR(191) NOT NULL,
    `datum` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `markt` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(191) NOT NULL,
    `valuta` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `markt_naam_key`(`naam`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aandelen` ADD CONSTRAINT `aandelen_marktId_fkey` FOREIGN KEY (`marktId`) REFERENCES `markt`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacties` ADD CONSTRAINT `transacties_gebruikerId_fkey` FOREIGN KEY (`gebruikerId`) REFERENCES `gebruikers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transacties` ADD CONSTRAINT `transacties_aandeelId_fkey` FOREIGN KEY (`aandeelId`) REFERENCES `aandelen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
