
USE karaqueue;

CREATE TABLE IF NOT EXISTS `constants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `constant_key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
