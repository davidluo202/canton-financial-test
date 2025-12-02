CREATE TABLE `chatRatings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chatLogId` int NOT NULL,
	`rating` enum('positive','negative') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatRatings_id` PRIMARY KEY(`id`)
);
