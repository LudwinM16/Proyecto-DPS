-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: gestion_proyectos
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actividad`
--

DROP TABLE IF EXISTS `actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actividad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accion` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_UsuarioActividad` (`usuario_id`),
  CONSTRAINT `FK_UsuarioActividad` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividad`
--

LOCK TABLES `actividad` WRITE;
/*!40000 ALTER TABLE `actividad` DISABLE KEYS */;
INSERT INTO `actividad` VALUES (1,'CREAR_USUARIO','Se creó el usuario: jose',1,'2025-03-10 20:13:22'),(2,'CREAR','El usuario \"jose\" fue creado con rol ID 3',1,'2025-03-10 20:13:22'),(3,'LOGIN','Inicio de sesión exitoso',1,'2025-03-10 20:15:14'),(4,'CREAR_USUARIO','Se creó el usuario: jose',1,'2025-03-10 20:15:14'),(5,'LOGIN','Inicio de sesión exitoso',1,'2025-03-10 20:20:19'),(6,'CREAR_USUARIO','Se creó el usuario: jose',1,'2025-03-10 20:20:19'),(7,'LOGIN','Inicio de sesión exitoso',1,'2025-03-10 20:26:33'),(8,'CREAR_USUARIO','Se creó el usuario: Jose gonzales',1,'2025-03-10 20:26:33'),(9,'CREAR_USUARIO','Se creó el usuario: Jose gonzales',1,'2025-03-10 20:34:14'),(10,'EDITAR','Usuario ID 12 actualizado',NULL,'2025-03-10 20:34:36'),(11,'ELIMINAR','Usuario ID 8 eliminado',NULL,'2025-03-10 20:34:42'),(12,'ELIMINAR','Se eliminó el usuario: Desconocido (ID: 13)',NULL,'2025-03-10 21:15:29'),(13,'CREAR_USUARIO','Se creó el usuario: Joel Pacheco con rol: Gerente de Proyectos',1,'2025-03-10 21:21:03'),(14,'CREAR_USUARIO','Se creó el usuario: Silvia Sofia con rol: Miembro del Equipo',1,'2025-03-10 21:21:18'),(15,'EDITAR','Se editó el usuario: Silvia Sofia (ID: 16)',NULL,'2025-03-10 21:21:26'),(16,'ELIMINAR','Se eliminó el usuario: Joel Pacheco (ID: 15)',NULL,'2025-03-10 21:21:30'),(17,'ELIMINAR','Se eliminó el usuario: Silvia Sofia (ID: 16)',NULL,'2025-03-10 21:44:30'),(18,'CREAR_USUARIO','Se creó el usuario: Prueba 3 con rol: Miembro del Equipo',1,'2025-03-10 21:48:58'),(19,'ELIMINAR','Se eliminó el usuario: Prueba 3 (ID: 17)',NULL,'2025-03-11 01:49:32'),(20,'ELIMINAR','Se eliminó el usuario: Jose (ID: 18)',NULL,'2025-03-11 01:55:47'),(21,'EDITAR','Se editó el usuario: jose (ID: 19)',NULL,'2025-03-11 02:04:55'),(22,'EDITAR','Se editó el usuario: jose mendez (ID: 19)',NULL,'2025-03-11 02:06:25'),(23,'EDITAR','Se editó el usuario: jose mendez vaquerano (ID: 19)',NULL,'2025-03-11 02:19:40'),(24,'CREAR_USUARIO','Se creó el usuario: sofia galdamez con rol: Miembro del Equipo',1,'2025-03-11 02:19:55'),(25,'ELIMINAR','Se eliminó el usuario: jose mendez vaquerano (ID: 19)',NULL,'2025-03-11 02:20:00'),(26,'ELIMINAR','Se eliminó el usuario: sofia galdamez (ID: 20)',1,'2025-03-11 02:30:30'),(27,'CREAR_USUARIO','Se creó el usuario: jose valenzuela con rol: Gerente de Proyectos',1,'2025-03-11 02:30:47'),(28,'EDITAR','Se editó el usuario: jose valenzuela (ID: 21)',1,'2025-03-11 02:31:17'),(29,'EDITAR','Se editó el usuario: jose (ID: 21)',1,'2025-03-11 03:32:45'),(30,'LOGIN','Inicio de sesión exitoso',1,'2025-03-11 03:38:00'),(31,'LOGIN','Inicio de sesión exitoso',1,'2025-03-11 03:38:51'),(32,'CREAR_USUARIO','Se creó el usuario: Jose2 con rol: Miembro del Equipo',1,'2025-03-11 03:39:11'),(33,'LOGIN','Inicio de sesión exitoso',22,'2025-03-11 03:39:26'),(34,'LOGIN','Inicio de sesión exitoso',1,'2025-03-11 03:39:56'),(35,'LOGIN','Inicio de sesión exitoso',1,'2025-03-11 03:52:45'),(36,'LOGIN','Inicio de sesión exitoso',1,'2025-03-11 03:55:13'),(37,'EDITAR','Se editó el usuario: Jose2 (ID: 22)',1,'2025-03-11 03:55:28'),(38,'LOGIN','Inicio de sesión exitoso',22,'2025-03-11 03:55:39'),(39,'LOGIN','Inicio de sesión exitoso',1,'2025-03-11 15:41:12'),(40,'LOGIN','Inicio de sesión exitoso',22,'2025-03-11 15:44:25'),(41,'LOGIN','Inicio de sesión exitoso',1,'2025-03-11 15:44:39'),(42,'EDITAR','Se editó el usuario: Jose2 (ID: 22)',1,'2025-03-11 15:44:53'),(43,'LOGIN','Inicio de sesión exitoso',22,'2025-03-11 15:45:14'),(44,'LOGIN','Inicio de sesión exitoso',1,'2025-03-11 16:47:01'),(45,'LOGIN','Inicio de sesión exitoso',1,'2025-03-12 02:21:10'),(46,'ELIMINAR','Se eliminó el usuario: jose (ID: 21)',1,'2025-03-12 02:21:17'),(47,'EDITAR','Se editó el usuario: Jose galdamez (ID: 22)',1,'2025-03-12 02:21:33'),(48,'CREAR_USUARIO','Se creó el usuario: joselito con rol: Miembro del Equipo',1,'2025-03-12 02:21:42');
/*!40000 ALTER TABLE `actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proyectos`
--

DROP TABLE IF EXISTS `proyectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proyectos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `gerente_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Gerente` (`gerente_id`),
  CONSTRAINT `FK_Gerente` FOREIGN KEY (`gerente_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proyectos`
--

LOCK TABLES `proyectos` WRITE;
/*!40000 ALTER TABLE `proyectos` DISABLE KEYS */;
INSERT INTO `proyectos` VALUES (1,'Proyecto A','Descripción del Proyecto A','2024-09-01','2024-12-31',2),(2,'Proyecto B','Descripción del Proyecto B','2024-10-01','2025-01-31',2);
/*!40000 ALTER TABLE `proyectos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador del Sistema'),(2,'Gerente de Proyectos'),(3,'Miembro del Equipo');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tareas`
--

DROP TABLE IF EXISTS `tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tareas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Pendiente',
  `proyecto_id` int(11) DEFAULT NULL,
  `asignado_a` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Proyecto` (`proyecto_id`),
  KEY `FK_AsignadoA` (`asignado_a`),
  CONSTRAINT `FK_AsignadoA` FOREIGN KEY (`asignado_a`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_Proyecto` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareas`
--

LOCK TABLES `tareas` WRITE;
/*!40000 ALTER TABLE `tareas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tareas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `rol_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Rol` (`rol_id`),
  CONSTRAINT `FK_Rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','$2b$10$RJBUoQ9iXDd8BjTaQQQ3wOQmDZHMbZuY8839E2J6zlGKyVWgizF9C',1),(2,'gerente','gerente123',2),(3,'miembro','miembro123',3),(22,'Jose galdamez','$2b$10$gJ2i49RxCXkcMTwrG9z3BejltpQqydfBCAIbeCtS.KyZpV6Fbk8Ii',3),(23,'joselito','$2b$10$M/z4Z.8yeZiTnKA7HnIO6OombJzBS/1CxojWy5cWl1bBWDU7XcDIK',3);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-11 20:22:47
