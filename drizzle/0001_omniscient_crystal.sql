CREATE TABLE `chatLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userMessage` text NOT NULL,
	`assistantMessage` text NOT NULL,
	`language` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatLogs_id` PRIMARY KEY(`id`)
);
