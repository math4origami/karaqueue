
CREATE USER 'karaqueue'@'localhost' IDENTIFIED BY 'contact80';
CREATE DATABASE IF NOT EXISTS karaqueue CHARACTER SET utf8 COLLATE utf8_unicode_ci;
GRANT SELECT ON karaqueue.* TO 'karaqueue'@'localhost';
GRANT INSERT ON karaqueue.* TO 'karaqueue'@'localhost';
GRANT DELETE ON karaqueue.* TO 'karaqueue'@'localhost';
GRANT UPDATE ON karaqueue.* TO 'karaqueue'@'localhost';
