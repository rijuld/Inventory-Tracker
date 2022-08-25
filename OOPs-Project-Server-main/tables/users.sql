CREATE TABLE `users` (
	`userId` VARCHAR(255) NOT NULL,
	`name` TEXT NOT NULL,
	`username` VARCHAR(50),
	`email` VARCHAR(50) NOT NULL,
	`phone` TEXT,
	`profession` TEXT,
	PRIMARY KEY (`userId`)
);
