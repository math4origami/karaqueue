
USE karaqueue;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `queue_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `cookie_id` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

ALTER TABLE `users` ADD COLUMN `cookie_id` varchar(255) DEFAULT NULL AFTER `name`;

ALTER TABLE `users` CHANGE `cookieId` `cookie_id` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL;
