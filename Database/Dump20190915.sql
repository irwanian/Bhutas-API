-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: bhutas
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brandname` varchar(20) NOT NULL,
  `image` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'nike','/post/images/BHT1567094660348.png'),(2,'jordan','/post/images/POS1568203222642.jpg'),(3,'adidas','/post/images/BHT1567094681240.png'),(4,'florsheim','/post/images/BHT1567094703618.png'),(5,'red wing','/post/images/BHT1567094720674.png');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `size` int(11) NOT NULL,
  `move_to_trx` int(11) DEFAULT '0',
  `product_deleted` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,11,2,6,1800000,9936000,47,1,0),(2,12,2,2,2200000,4224000,49,0,0);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryname` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'basketball'),(2,'sneakers'),(3,'boots'),(4,'formal');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productname` varchar(40) NOT NULL,
  `description` varchar(400) NOT NULL,
  `price` int(11) NOT NULL,
  `discount` int(11) DEFAULT '0',
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `isdeleted` tinyint(4) NOT NULL DEFAULT '0',
  `image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `delete brands_idx` (`brand_id`),
  KEY `edit category_idx` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'adidas zx 500 son goku','goku might have had an abundance of power, but did he have plenty of swag? find out next time by copping the adidas zx 500 dragon ball z son goku. this shoe comes with an orange upper, three denim stripes, and a white adidas boost sole. this powerful sneaker was released in september 2018. while searching for the dragon, place a bid for these on us.',5300000,5,2,3,0,'/post/images/products/BHT1568296279395.jpg'),(6,'air jordan 1 high react','the air jordan 1 gets equipped with react cushioning. ... both the raised rubber midfoot swoosh and the thick rope laces are super-sized, while red pull tabs run the length of the throat and appear on the heel; the former featuring jordan text branding while the latter is left unadorned.',5050000,10,2,2,0,'/post/images/products/BHT1568295639893.jpg'),(7,'red wing iron ranger','the iron ranger is an american icon that is beloved for its standout style and long-lasting construction. with its toe cap, speed hooks, and vibram® outsole, there’s no mistaking this leather legend.',7200000,0,3,5,0,'/post/images/products/BHT1567758532858.jpeg'),(9,'adidas harden vol-3 toxic','looking closer they feature hazard symbols and spray paint across the upper while utilizing both black and yellow. following we have orange on the forefoot strap and heel. other details includes a full length black boost midsole and the same shade across the rubber outsole.',2600000,5,1,3,0,'/post/images/products/BHT1568296647735.jpg'),(11,'nike air zoom freak 1','crush anything like the mvp',1800000,8,1,1,0,'/post/images/products/BHT1568302495479.jpg'),(12,'adidas x marvel marquee boost','a classic look gets upgraded with modern details. these basketball shoes are built for quickness and agility on the hardwood. they have a moulded ankle collar with a cushioned heel for support and comfort. a responsive midsole returns energy on every jumper, and a herringbone outsole provides extra grip as you stop and go on a dime.',2200000,4,1,3,0,'/post/images/products/BHT1568307724747.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productstocks`
--

DROP TABLE IF EXISTS `productstocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productstocks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productid` int(11) NOT NULL,
  `size_46` int(11) DEFAULT '0',
  `size_47` int(11) DEFAULT '0',
  `size_48` int(11) DEFAULT '0',
  `size_49` int(11) DEFAULT '0',
  `size_50` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productstocks`
--

LOCK TABLES `productstocks` WRITE;
/*!40000 ALTER TABLE `productstocks` DISABLE KEYS */;
INSERT INTO `productstocks` VALUES (1,1,23,17,16,12,6),(3,5,22,17,16,12,8),(4,6,22,17,16,12,0),(5,7,22,17,16,12,8),(6,10,22,17,16,8,21),(7,8,22,17,16,12,8),(8,9,22,13,16,12,7),(9,11,28,17,10,10,3),(10,12,22,8,11,12,3);
/*!40000 ALTER TABLE `productstocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `size`
--

DROP TABLE IF EXISTS `size`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `size` (
  `size_number` int(11) NOT NULL,
  PRIMARY KEY (`size_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `size`
--

LOCK TABLES `size` WRITE;
/*!40000 ALTER TABLE `size` DISABLE KEYS */;
INSERT INTO `size` VALUES (46),(47),(48),(49),(50);
/*!40000 ALTER TABLE `size` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '0',
  `transaction_canceled` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,2,9936000,'2019-09-15 06:48:23',0,0),(2,2,4224000,'2019-09-15 06:48:23',0,0),(4,2,9936000,'2019-09-15 07:35:44',0,0),(5,2,4224000,'2019-09-15 07:35:44',0,0),(7,2,9936000,'2019-09-15 07:43:05',0,0),(8,2,9936000,'2019-09-15 07:46:37',0,0),(9,2,4224000,'2019-09-15 07:46:37',0,0),(11,2,4224000,'2019-09-15 07:49:35',0,0);
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_item`
--

DROP TABLE IF EXISTS `transaction_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transaction_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_item`
--

LOCK TABLES `transaction_item` WRITE;
/*!40000 ALTER TABLE `transaction_item` DISABLE KEYS */;
INSERT INTO `transaction_item` VALUES (1,1,11,1800000,6),(2,2,12,2200000,2),(4,1,11,1800000,6),(5,1,12,2200000,2),(6,2,11,1800000,6),(7,2,12,2200000,2),(8,4,11,1800000,6),(9,4,12,2200000,2),(10,5,11,1800000,6),(11,5,12,2200000,2),(12,7,11,1800000,6),(13,7,12,2200000,2),(14,8,11,1800000,6),(15,8,12,2200000,2),(16,9,11,1800000,6),(17,9,12,2200000,2),(19,1,12,2200000,2),(20,2,12,2200000,2),(21,4,12,2200000,2),(22,5,12,2200000,2),(23,7,12,2200000,2),(24,8,12,2200000,2),(25,9,12,2200000,2),(26,11,12,2200000,2);
/*!40000 ALTER TABLE `transaction_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(45) NOT NULL,
  `password` varchar(64) NOT NULL,
  `email` varchar(45) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT '2',
  `status` int(11) NOT NULL DEFAULT '0',
  `last_login` datetime NOT NULL,
  `is_login` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'irwan ramadhan','c69a3c25a169d2ed7eb5cfd03626edb3964975d75383d1a458defc73f9e0f391','irwanramadhan288@gmail.com',1,1,'2019-09-15 00:00:28',0),(2,'ucok balboa','c69a3c25a169d2ed7eb5cfd03626edb3964975d75383d1a458defc73f9e0f391','irwan167@ymail.com',2,1,'2019-09-15 00:04:34',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voucher`
--

DROP TABLE IF EXISTS `voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voucher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discount` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher`
--

LOCK TABLES `voucher` WRITE;
/*!40000 ALTER TABLE `voucher` DISABLE KEYS */;
/*!40000 ALTER TABLE `voucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_Id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-15 15:03:33
