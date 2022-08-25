CREATE TABLE `categories` (
	`categoryId` BIGINT NOT NULL AUTO_INCREMENT,
	`userId` VARCHAR(255) NOT NULL,
	`category` TEXT NOT NULL,
	PRIMARY KEY (`categoryId`)
);
