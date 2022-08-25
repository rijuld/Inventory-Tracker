CREATE TABLE `task` (

	`title` TEXT NOT NULL,
	`description` TEXT,
	`taskId` BIGINT NOT NULL AUTO_INCREMENT,
	`userId` VARCHAR(255) NOT NULL,
	`time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`tasktime` DATETIME,
	PRIMARY KEY (`taskId`)
);