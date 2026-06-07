CREATE TABLE `auth` (
	`id` varchar(6) NOT NULL,
	`name` varchar(30) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255),
	`salt_string` varchar(255),
	`isBlocked` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auth_email` PRIMARY KEY(`email`)
);
