
USE karaqueue;

CREATE TABLE IF NOT EXISTS `queues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT "",
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
