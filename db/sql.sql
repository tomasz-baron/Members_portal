ALTER TABLE  `Login` ADD  `last_login` DATE NULL DEFAULT NULL;
RENAME TABLE  `db9_aegee_pl`.`Login` TO  `db9_aegee_pl`.`users` ;
ALTER TABLE  `users` CHANGE  `login_id`  `id` INT( 10 ) NOT NULL AUTO_INCREMENT COMMENT  'id loginu';
ALTER TABLE  `users` ADD  `session_id` VARCHAR( 256 ) NULL DEFAULT NULL;
RENAME TABLE  `db9_aegee_pl`.`Members` TO  `db9_aegee_pl`.`members` ;
ALTER TABLE `members` DROP `pr`;
ALTER TABLE `members` DROP `hr`;
ALTER TABLE `members` DROP `fr`;
ALTER TABLE `members` DROP `it`;
RENAME TABLE  `db9_aegee_pl`.`Payments` TO  `db9_aegee_pl`.`payments` ;
ALTER TABLE `payments` CHANGE `expiration_date` `expirationDate` DATE NOT NULL COMMENT 'Data wygaśnięcia składki';
ALTER TABLE `members` DROP FOREIGN KEY `members_ibfk_1`;
ALTER TABLE `members` CHANGE `mentor_id` `mentorId` INT(10) NOT NULL DEFAULT '0' COMMENT 'ID mentora. ID = 0 oznacza, że członek jest mentorem.';
ALTER TABLE `members` ADD CONSTRAINT `members_ibfk_1` FOREIGN KEY (mentorId) REFERENCES `members`(id);
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_1`;
ALTER TABLE `users` CHANGE `member_id` `memberId` INT(10) NOT NULL COMMENT 'id użytkownika';
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (memberId) REFERENCES `members`(id);
ALTER TABLE `users` CHANGE `last_login` `lastLogin` DATE NULL DEFAULT NULL;
ALTER TABLE `users` CHANGE `session_id` `sessionId` VARCHAR(256) CHARACTER SET utf8 COLLATE utf8_polish_ci NULL DEFAULT NULL;
ALTER TABLE `users` CHANGE `lastLogin` `lastLogin` DATETIME NULL DEFAULT NULL;
ALTER TABLE `payments` DROP FOREIGN KEY `payments_ibfk_1`;
ALTER TABLE `payments` CHANGE `member_id` `memberId` INT(10) NOT NULL COMMENT 'Użytkownik, który opłacił składkę';
ALTER TABLE `payments` ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (memberId) REFERENCES `members`(id);
ALTER TABLE `payments` CHANGE `date` `paymentDate` DATE NOT NULL COMMENT 'Data płatności składki';
ALTER TABLE `payments` CHANGE `year` `year` YEAR(4) NULL;
ALTER TABLE `payments` CHANGE `auditCD` `auditCD` DATETIME NOT NULL COMMENT 'Data wpisu do bazy';
// 21-11-2016
ALTER TABLE `users` ADD `readNews` BOOLEAN NOT NULL DEFAULT FALSE AFTER `memberId`;
UPDATE `users` SET readNews = 1;
INSERT INTO `news` (content, newsDate) VALUES ('Możliwość zaznaczenia wielu wierszy gestem longpress -> umożliwienie wprowadzenia składki dla wielu członków z poziomu jednej formatki.', '2016-11-21');

// 03-12-2016
CREATE TABLE `logs` (
  `id` int(10) NOT NULL COMMENT 'id',
  `memberId` int(10) NOT NULL COMMENT 'id czlonka, dla ktorego przeprowadzono zmiane',
  `memberUserId` int(10) NOT NULL COMMENT 'id usera, ktory przeprowadzil zmiane',
  `ldate` datetime NOT NULL COMMENT 'data dokonania zmian',
  `type` int(2) NOT NULL COMMENT 'typ zmiany 1 - dodanie czlonka, 2 - dodanie składki, 3 - utworzenie uzytkownika, 4 - przeniesienie do bylych czlonkow, 5 - przywrocenie czlonka'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci COMMENT='Logi aplikacji';
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `logs_ibfk_1` (`memberId`),
  ADD KEY `logs_ibfk_2` (`memberUserId`);
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `members` (`id`);
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_2` FOREIGN KEY (`memberUserId`) REFERENCES `users` (`id`);  
ALTER TABLE `logs` CHANGE `id` `id` INT(10) NOT NULL AUTO_INCREMENT COMMENT 'id loginu';

// 26-12-2016
ALTER TABLE `members` CHANGE `type` `type` VARCHAR(1) CHARACTER SET utf8 COLLATE utf8_polish_ci NOT NULL DEFAULT 'C' COMMENT 'Z - członek zarządu, K - komisja rewizyjna, H - członek honorowy, C - członek zwyczajny';
UPDATE `members` SET type='C' WHERE type='K';
UPDATE `members` SET type='K' WHERE type='R';
ALTER TABLE `members` DROP `connectedToList`;