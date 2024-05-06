-- --------------------------------------------------------
-- Anfitrião:                    192.168.1.1
-- Versão do servidor:           8.0.31 - MySQL Community Server - GPL
-- SO do servidor:               Win64
-- HeidiSQL Versão:              12.4.0.6659
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- A despejar estrutura da base de dados para haxball
CREATE DATABASE IF NOT EXISTS `haxball` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `haxball`;

-- A despejar estrutura para tabela haxball.bans
CREATE TABLE IF NOT EXISTS `bans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `time` datetime DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `banned_by` text,
  `conn` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ipv4` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `auth` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9779 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Aqui todos os bans são armazenados.';

-- Exportação de dados não seleccionada.

-- A despejar estrutura para tabela haxball.comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comentador` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `noperfil` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `comment` longtext,
  `when` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Local onde os comentários nos perfis são guardados.';

-- Exportação de dados não seleccionada.

-- A despejar estrutura para tabela haxball.mutes
CREATE TABLE IF NOT EXISTS `mutes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `time` datetime DEFAULT NULL,
  `reason` text,
  `muted_by` text,
  `conn` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ipv4` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `auth` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Aqui todos os mutes são armazenados.';

-- Exportação de dados não seleccionada.

-- A despejar estrutura para tabela haxball.players
CREATE TABLE IF NOT EXISTS `players` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_id` int DEFAULT '0',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` text COLLATE utf8mb4_unicode_ci,
  `loggedIn` int DEFAULT '0',
  `ceo` int DEFAULT '0',
  `gerente` int DEFAULT '0',
  `admin` int DEFAULT '0',
  `mod` int DEFAULT '0',
  `vip` int DEFAULT '0',
  `furar` int DEFAULT '0',
  `pause` int DEFAULT '0',
  `conn` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ipv4` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `auth` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3174 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Onde todos os dados dos jogadores são guardados.';

CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `log` varchar(20) NULL,
  `replay` varchar(20) NULL,
  `error` varchar(20) NULL,
  `join` varchar(20) NULL,
  `status` varchar(20) NULL,
  PRIMARY KEY (`id`)
);
-- INSERT INTO rooms (name) VALUES ('TESTES');

CREATE TABLE IF NOT EXISTS `stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `player_id` int NOT NULL,
  `elo` int DEFAULT '1000',
  `games` int DEFAULT '0',
  `goals` int DEFAULT '0',
  `assists` int DEFAULT '0',
  `ag` int DEFAULT '0',
  `cs` int DEFAULT '0',
  `wins` int DEFAULT '0',
  `losses` int DEFAULT '0',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  FOREIGN KEY (`player_id`) REFERENCES `players` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `uniformes` (
  `IDUNI` int DEFAULT '0',
  `shortName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uniform` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3174 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Onde todos os dados dos jogadores são guardados.';

-- Criação dos uniformes (da pra criar um uniformes.sql mas precisa lembrar sempre que for configurar uma nova sala de rodar os dois sqls)
INSERT INTO uniformes (IDUNI, type, shortName, longName, country, uniform)
VALUES
(1, 'member', 'trn', 'KF Tirana', 'Albania', '[{\"angle\":0,\"mainColor\":[22955,16777215,22955],\"avatarColor\":16763395},{\"angle\":0,\"mainColor\":[16763395],\"avatarColor\":22955}]'),
(2, 'member', 'boca', 'Club Atlético Boca Juniors', 'Argentina', '[{\"angle\":0,\"mainColor\":[1064825,15970857,1064825],\"avatarColor\":16777215},{\"angle\":0,\"mainColor\":[16777215],\"avatarColor\":1064825}]'),
(3, 'member', 'rvp', 'Club Atlético River Plate', 'Argentina', '[{\"angle\":30,\"mainColor\":[16777215,16711680,16777215],\"avatarColor\":0},{\"angle\":0,\"mainColor\":[0,4210752,0],\"avatarColor\":16711680}]'),
(4, 'member', 'mlb', 'Melbourne City FC', 'Australia', '[{\"angle\":0,\"mainColor\":[8041185],\"avatarColor\":14883124},{\"angle\":0,\"mainColor\":[0],\"avatarColor\":14883124}]'),
(5, 'member', 'slz', 'FC Red Bull Salzburg', 'Austria', '[{\"angle\":15,\"mainColor\":[16711680,16777215,16711680],\"avatarColor\":0},{\"angle\":15,\"mainColor\":[128,16776960,128],\"avatarColor\":16777215}]'),
(6, 'member', 'sgrz', 'SK Sturm Graz', 'Austria', '[{\"angle\":0,\"mainColor\":[16777215,0,16777215],\"avatarColor\":49152},{\"angle\":0,\"mainColor\":[0],\"avatarColor\":49152}]'),
(7, 'member', 'bate', 'FK BATE Borisov', 'Belarus', '[{\"angle\":0,\"mainColor\":[16776960,33023,16776960],\"avatarColor\":0},{\"angle\":0,\"mainColor\":[16776960],\"avatarColor\":33023}]'),
(8, 'member', 'gml', 'FK Gomel', 'Belarus', '[{\"angle\":0,\"mainColor\":[16777215,49152,16777215],\"avatarColor\":0},{\"angle\":0,\"mainColor\":[0,65280,0],\"avatarColor\":16777215}]'),
(9, 'member', 'clb', 'Club Brugge KV', 'Belgium', '[{\"angle\":0,\"mainColor\":[0,255,0],\"avatarColor\":16777215},{\"angle\":45,\"mainColor\":[16777215,12632256,16777215],\"avatarColor\":255}]'),
(10, 'member', 'gnt', 'KAA Gent', 'Belgium', '[{\"angle\":0,\"mainColor\":[255],\"avatarColor\":16777215},{\"angle\":0,\"mainColor\":[16776960],\"avatarColor\":255}]'),
(11, 'member', 'gnk', 'KRC Genk', 'Belgium', '[{\"angle\":0,\"mainColor\":[128,255,128],\"avatarColor\":16777215},{\"angle\":90,\"mainColor\":[0,16777215,0],\"avatarColor\":255}]'),
(12, 'member', 'ant', 'Royal Antwerp FC', 'Belgium', '[{\"angle\":90,\"mainColor\":[12582912,16711680,12582912],\"avatarColor\":16777215},{\"angle\":0,\"mainColor\":[16776960,16776960,0],\"avatarColor\":16711680}]'),
(13, 'member', 'and', 'RSC Anderlecht', 'Belgium', '[{\"angle\":0,\"mainColor\":[8388863,4194432,8388863],\"avatarColor\":16777215},{\"angle\":0,\"mainColor\":[16777215,12632256,16777215],\"avatarColor\":8388863}]'),
(14, 'member', 'fla', 'CR Flamengo', 'Brazil', '[{\"angle\":90,\"mainColor\":[0,16711680,0],\"avatarColor\":16777215},{\"angle\":90,\"mainColor\":[16777215,0,16777215],\"avatarColor\":16711680}]'),
(15, 'member', 'san', 'Santos FC', 'Brazil', '[{\"angle\":0,\"mainColor\":[12582912,16728064,12582912],\"avatarColor\":0},{\"angle\":0,\"mainColor\":[16728064,12582912],\"avatarColor\":0}]'),
(16, 'member', 'sao', 'São Paulo FC', 'Brazil', '[{\"angle\":0,\"mainColor\":[16777215,14737632,16777215],\"avatarColor\":0},{\"angle\":0,\"mainColor\":[0,16777215,0],\"avatarColor\":16776960}]'),
(17, 'member', 'cor', 'SC Corinthians Paulista', 'Brazil', '[{\"angle\":90,\"mainColor\":[16777215,0,16777215],\"avatarColor\":8421504},{\"angle\":90,\"mainColor\":[0,16777215,0],\"avatarColor\":32768}]'),
(18, 'member', 'pal', 'SE Palmeiras', 'Brazil', '[{\"angle\":90,\"mainColor\":[32768,16777215,32768],\"avatarColor\":16777152},{\"angle\":0,\"mainColor\":[16777215,32768,16777215],\"avatarColor\":16777152}]'),
(19, 'member', 'lud', 'PFK Ludogorets Razgrad', 'Bulgaria', '[{\"angle\":75,\"mainColor\":[32768,16777215,32768],\"avatarColor\":0},{\"angle\":0,\"mainColor\":[32768],\"avatarColor\":16777215}]'),
(20, 'member', 'bei', 'Beijing Guoan FC', 'China', '[{\"angle\":0,\"mainColor\":[49152,32768,49152],\"avatarColor\":16776960},{\"angle\":0,\"mainColor\":[8453888,16777215,8453888],\"avatarColor\":16776960}]')

-- Exportação de dados não seleccionada.

-- A despejar estrutura para tabela haxball.streak
CREATE TABLE IF NOT EXISTS `streak` (
  `games` int DEFAULT NULL,
  `player1` text,
  `player2` text,
  `player3` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Local onde a topstreak é guardada.';

-- Exportação de dados não seleccionada.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
