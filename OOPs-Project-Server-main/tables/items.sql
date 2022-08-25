CREATE TABLE `items` (
	`name` TEXT NOT NULL,
	`categoryId` BIGINT NOT NULL,
	`category` TEXT NOT NULL,
	`itemId` BIGINT NOT NULL AUTO_INCREMENT,
	`userId` VARCHAR(255) NOT NULL,
	`image` TEXT,
	`quantity` INT NOT NULL,
	`unit` VARCHAR(15),
	`roQuantity` INT,
	PRIMARY KEY (`itemId`)
);
