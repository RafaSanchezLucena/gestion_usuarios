// Las sentencias SQL necesarias para crear la tabla

CREATE TABLE `alumnos`
(
 `id_alumno` integer NOT NULL AUTO_INCREMENT ,
 `dni`       varchar(20) NOT NULL ,
 `nombre`    varchar(150) NOT NULL ,
 `apellido1` varchar(150) NOT NULL ,
 `apellido2` varchar(150) NOT NULL ,
 `email`  varchar(150) NOT NULL ,
 `password`     varchar(50) NOT NULL ,

PRIMARY KEY (`id_alumno`)
);