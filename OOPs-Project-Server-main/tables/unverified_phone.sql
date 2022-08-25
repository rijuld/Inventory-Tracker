CREATE TABLE `unverified_phone` (
	`phone` VARCHAR(15) NOT NULL,
	`otp` INT NOT NULL,
	`exp` BIGINT NOT NULL,
	`userId` VARCHAR(255) NOT NULL,
	`retries` INT DEFAULT 0,
	PRIMARY KEY (`userId`)
);
