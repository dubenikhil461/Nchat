CREATE TABLE `auth` (
	`id` varchar(6) NOT NULL,
	`name` varchar(30) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255),
	`salt_string` varchar(255),
	`isBlocked` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auth_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_email_unique` UNIQUE(`email`)
);

CREATE TABLE `message` (
	`id` varchar(36) NOT NULL,
	`sender_id` varchar(6) NOT NULL,
	`receiver_id` varchar(6) NOT NULL,
	`text` text NOT NULL,
	`delivered_at` timestamp,
	`read_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `message_id` PRIMARY KEY(`id`)
);

ALTER TABLE `message` ADD CONSTRAINT `message_sender_id_auth_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `auth`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `message` ADD CONSTRAINT `message_receiver_id_auth_id_fk` FOREIGN KEY (`receiver_id`) REFERENCES `auth`(`id`) ON DELETE no action ON UPDATE no action;