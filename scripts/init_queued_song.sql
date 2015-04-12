
USE karaqueue;

CREATE TABLE IF NOT EXISTS `queued_song` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `queue_id` int(11) NOT NULL,
  `queue_index` int(11) NOT NULL,
  `song_id` int(11) NOT NULL DEFAULT '0',
  `type` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `location` (`queue_id`,`queue_index`)
);

ALTER TABLE  `queued_song`
ADD `song_id` int(11) NOT NULL DEFAULT '0'
AFTER  `queue_index`;