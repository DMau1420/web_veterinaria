/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.2.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: bd_vet
-- ------------------------------------------------------
-- Server version	12.2.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mascota_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `estado` enum('Pendiente','Confirmada','Cancelada','Completada') DEFAULT 'Pendiente',
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `mascota_id` (`mascota_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `1` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES
(1,1,13,'2026-06-01','10:00:00','Chequeo general y vacunas anuales','Pendiente','2026-05-21 00:34:09'),
(2,2,13,'2026-06-02','16:30:00','Limpieza dental','Pendiente','2026-05-21 00:34:09'),
(3,3,14,'2026-06-05','11:15:00','Consulta por alergia en la piel','Pendiente','2026-05-21 00:34:09'),
(4,5,10,'2026-05-26','13:30:00','Vacuna','Confirmada','2026-05-21 01:31:54'),
(5,5,10,'2026-05-25','19:00:00','baño','Pendiente','2026-05-21 01:32:18'),
(10,5,10,'2026-05-22','17:25:00','Revision','Pendiente','2026-05-22 18:30:20'),
(11,9,18,'2026-05-26','19:00:00','Revision','Pendiente','2026-05-22 18:51:02'),
(12,10,19,'2026-05-23','12:30:00','Revision','Confirmada','2026-05-22 19:09:07');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `mascotas`
--

DROP TABLE IF EXISTS `mascotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `mascotas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `especie` varchar(50) NOT NULL,
  `raza` varchar(50) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `proxima_vacuna` date DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascotas`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `mascotas` WRITE;
/*!40000 ALTER TABLE `mascotas` DISABLE KEYS */;
INSERT INTO `mascotas` VALUES
(1,13,'Max','Perro','Golden Retriever',3,32.50,'2026-12-15','imagenes-backend/max.jpg','2026-05-21 00:34:09'),
(2,13,'Luna','Gato','Siamés',2,4.20,'2026-10-20','imagenes-backend/luna.jpg','2026-05-21 00:34:09'),
(3,14,'Rocky','Perro','Bulldog',5,24.00,'2026-08-05','imagenes-backend/rocky.jpg','2026-05-21 00:34:09'),
(5,10,'Persi','Perro','husky',2,27.00,'2026-06-12','imagenes-backend/mausandoval10/persi.jpg','2026-05-21 01:17:09'),
(9,18,'Michigan','Gato','gato',1,1.80,'2026-10-22','imagenes-backend/karinasan18/michigan.jpg','2026-05-21 02:25:41'),
(10,19,'Camotito','Perro','Canelo',NULL,NULL,NULL,NULL,'2026-05-22 19:08:33');
/*!40000 ALTER TABLE `mascotas` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('ADMIN','USER') DEFAULT 'USER',
  `fecha_registro` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES
(10,'mau sandoval','','mau@gmail.com','$2b$12$u/fg0W4OkN0kKsXB3yht1.qlvs19Gvv9jh1NHPh3hDzBnv.IN30Vm','4271612708','USER','2026-05-20 22:37:55'),
(11,'nose amigo','','nose@gmail.com','$2b$12$prr575Fmcsggcdv2anBlQ.AgZI2jBbu.i1lmEX2RjXeauAxPEYZgu','4857958601','USER','2026-05-20 22:38:51'),
(12,'dani mtz','','dani@gmail.com','$2b$12$V182RF5p42In33BKE7YBPO.7Y9XAzE.kWr10cMRUt.VXteIjpl0Gu','7418529635','USER','2026-05-20 22:40:03'),
(13,'Carlos','Mendoza','carlos@email.com','$2b$12$dcVO05ao2iBG/3yEPTpkveY43XbBcm/8b6Jn6UQOMNfsqGSU2Bsx.','4421234567','USER','2026-05-21 00:34:09'),
(14,'Ana','Gómez','ana@email.com','$2b$12$RFEgxIgPeFUYeSMpK4KVaeTK07locSGw5QUrRUnfaAxVydHMuHVSO','4427654321','USER','2026-05-21 00:34:09'),
(15,'Admin','Veterinaria','admin@veterinaria.com','$2b$12$pyX4sPoCHv8uPLA3QFXCWuoSCWU8rtZUc5E1iC9sFQ1UJbiLArNqi','4429998887','ADMIN','2026-05-21 00:34:09'),
(16,'mau','sandoval Mandujano','mau2@gmail.com','$2b$12$ofb.jTKkND6RR7TVUzfb2O5o/28jRR5qGnRkkfMlU6cDHoDLBvWAS','8945612456','USER','2026-05-21 00:38:27'),
(17,'bruno luis','ernesto cañada castañeda','brub@gmail.com','$2b$12$PHlqJpH2/pQOG2iBvj8UJOicgm.8d3qI7SxTGYTh4UOrSG8wsL5ee','784652315','USER','2026-05-21 00:39:08'),
(18,'Karina','Sandoval Mandujano','karina@gmail.com','$2b$12$YZ4u9qYo3oTewrT1CtfJo.D0Nhhp/eisFe8m3WaWzSIwjgMt2PYqi','4277894529','USER','2026-05-21 02:24:17'),
(19,'Juan Carlo','Hurtado Trejo','juanc@gmail.com','$2b$12$UZZ33feHxI0MLj2hrZ28Xe1UkBEbOq0BD9Iz/lcI22oT4UtroAmCW','782562315','USER','2026-05-22 19:07:54');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-05-25 18:08:05
