-- already stablished data schema by @Dario
CREATE TABLE `departamentos` (
  `empresa` varchar(2) NOT NULL DEFAULT '01',
  `sucursal` varchar(2) NOT NULL COMMENT 'name of the sucursal',
  `coddepar` varchar(3) NOT NULL COMMENT '[automatic] code of the department',
  `nombre` varchar(80) NOT NULL COMMENT 'name of the department',
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `gruposaf` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(250) NOT NULL COMMENT 'Name of the group',
  `ctagasto` varchar(20) DEFAULT NULL COMMENT '[solo lectura] llenado por contable',
  `ctaacum` varchar(20) DEFAULT NULL COMMENT '[solo lectura] llenado por contable',
  `empresa` char(2) DEFAULT '01',
  `sucursal` char(2) DEFAULT '01',
  `codgrupo` char(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `productsaf` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `modelo` varchar(255) NOT NULL,
  `serie` varchar(150) NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `porcdep` decimal(12,2) NOT NULL, -- TODO: lo llena contable,
  -- `title` varchar(255) NOT NULL,
  `status` enum('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  `fechac` date DEFAULT NULL COMMENT 'Fecha compra',
  `deletedAt` datetime(6) DEFAULT NULL,
  `userId` int NOT NULL,
  `grupoafId` int NOT NULL,
  `departamentoId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_99d90c2a483d79f3b627fb1d5e9` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `productsaf_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` text NOT NULL,
  `productafId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7378beebe3320f7e6fe5bb3145f` (`productafId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Usuarios`(
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NULL,
  `email` varchar(250) unique NOT NULL,
  `password` char(97) NOT NULL COMMENT 'Argon2i hashed password',
  `rol` ENUM('root', 'admin', 'user') NOT NULL DEFAULT 'user',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)engine=InnoDB;

CREATE TABLE `Sesiones`(
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `refresh_token` text NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  constraint `fk_user_id` foreign key (`user_id`) references `Usuarios`(`id`)
    on update cascade on delete cascade
)engine=InnoDB;
