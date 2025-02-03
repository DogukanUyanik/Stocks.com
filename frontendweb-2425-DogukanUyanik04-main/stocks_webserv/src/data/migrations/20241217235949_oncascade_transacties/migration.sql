-- DropForeignKey
ALTER TABLE `transacties` DROP FOREIGN KEY `transacties_gebruikerId_fkey`;

-- AddForeignKey
ALTER TABLE `transacties` ADD CONSTRAINT `transacties_gebruikerId_fkey` FOREIGN KEY (`gebruikerId`) REFERENCES `gebruikers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
