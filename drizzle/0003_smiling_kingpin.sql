CREATE TABLE `news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`content` varchar(300) NOT NULL,
	`image1` text,
	`image2` text,
	`image3` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
