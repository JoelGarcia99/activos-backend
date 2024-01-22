-- already stablished data schema by @Dario
CREATE TABLE `departamentos` (
  `empresa` varchar(2) NOT NULL COMMENT 'Name of the company',
  `sucursal` varchar(2) NOT NULL COMMENT 'name of the sucursal',
  `coddepar` varchar(3) NOT NULL COMMENT 'code of the department',
  `nombre` varchar(80) NOT NULL COMMENT 'name of the department',
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `gruposaf` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(250) NOT NULL COMMENT 'Name of the group',
  `ctagasto` varchar(20) DEFAULT NULL COMMENT 'Cuenta de gasot?',
  `ctaacum` varchar(20) DEFAULT NULL COMMENT 'Cuenta de acumulado?',
  `empresa` char(2) DEFAULT NULL,
  `sucursal` char(2) DEFAULT NULL,
  `codgrupo` char(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Usuarios`(
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NULL,
  `email` varchar(250) unique NOT NULL,
  `password` char(87) NOT NULL  COMMENT 'Argon2i hashed password',
  `rol` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
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
