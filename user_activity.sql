SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema user_activity
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema user_activity
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `user_activity` DEFAULT CHARACTER SET utf8 ;
USE `user_activity` ;

-- -----------------------------------------------------
-- Table `user_activity`.`rate_review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_activity`.`rate_review` (
  `id` BIGINT(20) NOT NULL,
  `review` LONGTEXT NOT NULL,
  `rating` ENUM('1', '2', '3', '4', '5') NOT NULL,
  `reference_type` ENUM('PRATILIPI', 'AUTHOR') NOT NULL,
  `reference_id` BIGINT(20) NOT NULL,
  `user_id` BIGINT(20) NOT NULL,
  `vote_count` INT ZEROFILL NOT NULL,
  `comment_count` INT ZEROFILL NOT NULL,
  `state` ENUM('DRAFTED', 'SUBMITTED', 'PUBLISHED', 'BLOCKED', 'DELETED') NOT NULL,
  `date_created` DATETIME NOT NULL,
  `date_updated` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_id_user_id` (`reference_id`,`user_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `user_activity`.`vote`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_activity`.`vote` (
  `id` BIGINT(20) NOT NULL,
  `type` ENUM('LIKE', 'NONE') NOT NULL,
  `reference_type` ENUM('RATE_REVIEW', 'COMMENT') NOT NULL,
  `reference_id` BIGINT(20) NOT NULL,
  `user_id` BIGINT(20) NOT NULL,
  `date_created` DATETIME NOT NULL,
  `date_updated` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_id_user_id` (`reference_id`,`user_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `user_activity`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_activity`.`comment` (
  `id` BIGINT(20) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `reference_type` ENUM('REVIEW') NOT NULL,
  `reference_id` BIGINT(20) NOT NULL,
  `user_id` BIGINT(20) NOT NULL,
  `vote_count` INT ZEROFILL NOT NULL,
  `state` ENUM('ACTIVE', 'BLOCKED', 'DELETED') NOT NULL,
  `date_created` DATETIME NOT NULL,
  `date_updated` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_id_user_id` (`reference_id`,`user_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `user_activity`.`follow`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_activity`.`follow` (
  `id` BIGINT(20) NOT NULL,
  `reference_type` ENUM('AUTHOR') NOT NULL,
  `reference_id` BIGINT(20) NOT NULL,
  `user_id` BIGINT(20) NOT NULL,
  `state` ENUM('FOLLOWING', 'UNFOLLOWED') NOT NULL,
  `date_created` DATETIME NOT NULL,
  `date_updated` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_id_user_id` (`reference_id`,`user_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `user_activity`.`complain`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_activity`.`complain` (
  `id` BIGINT(20) NOT NULL,
  `type` ENUM('INAPPROPRIATE', 'VIOLATION') NOT NULL,
  `reference_type` ENUM('RATE_REVIEW', 'COMMENT') NOT NULL,
  `reference_id` BIGINT(20) NOT NULL,
  `user_id` BIGINT(20) NOT NULL,
  `state` ENUM('OPEN', 'DELETED') NOT NULL,
  `date_created` DATETIME NOT NULL,
  `date_updated` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_id_user_id` (`reference_id`,`user_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
