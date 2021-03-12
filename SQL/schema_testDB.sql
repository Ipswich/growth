-- MySQL dump 10.18  Distrib 10.3.27-MariaDB, for debian-linux-gnueabihf (armv8l)
--
-- Host: localhost    Database: growth-test
-- ------------------------------------------------------
-- Server version	10.3.27-MariaDB-0+deb10u1

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
-- Current Database: `growth-test`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `growth-test` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `growth-test`;

--
-- Table structure for table `Events`
--

DROP TABLE IF EXISTS `Events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Events` (
  `eventID` int(11) NOT NULL AUTO_INCREMENT,
  `eventName` varchar(64) NOT NULL,
  `eventDescription` varchar(128) DEFAULT NULL,
  `Eenabled` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`eventID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Events`
--

LOCK TABLES `Events` WRITE;
/*!40000 ALTER TABLE `Events` DISABLE KEYS */;
INSERT INTO `Events` VALUES (1,'Output On','ON',1),(2,'Output Off','OFF',1),(3,'Email Warn','Email Warn',1),(4,'Python Script','Run Python Script',1);
/*!40000 ALTER TABLE `Events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OutputTypes`
--

DROP TABLE IF EXISTS `OutputTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OutputTypes` (
  `outputTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `outputType` varchar(32) NOT NULL,
  `outputPWM` tinyint(1) NOT NULL DEFAULT 0,
  `outputPWMInversion` tinyint(1) NOT NULL DEFAULT 0,
  `OTenabled` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`outputTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OutputTypes`
--

LOCK TABLES `OutputTypes` WRITE;
/*!40000 ALTER TABLE `OutputTypes` DISABLE KEYS */;
INSERT INTO `OutputTypes` VALUES (1,'PWM Light',1,1,1),(2,'Light',0,0,1),(3,'Circulation',0,0,1),(4,'Exhaust',0,0,1),(5,'PWM Exhaust',1,1,1),(6,'Intake',0,0,1),(7,'Heat',0,0,1),(8,'Water',0,0,1);
/*!40000 ALTER TABLE `OutputTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Outputs`
--

DROP TABLE IF EXISTS `Outputs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Outputs` (
  `outputID` int(11) NOT NULL AUTO_INCREMENT,
  `outputTypeID` int(11) NOT NULL,
  `outputName` varchar(64) NOT NULL,
  `outputDescription` varchar(128) DEFAULT NULL,
  `Oenabled` tinyint(1) NOT NULL DEFAULT 1,
  `outputOrder` int(11) DEFAULT 0,
  PRIMARY KEY (`outputID`),
  KEY `outputTypeID` (`outputTypeID`),
  CONSTRAINT `Outputs_ibfk_1` FOREIGN KEY (`outputTypeID`) REFERENCES `OutputTypes` (`outputTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Outputs`
--

LOCK TABLES `Outputs` WRITE;
/*!40000 ALTER TABLE `Outputs` DISABLE KEYS */;
/*!40000 ALTER TABLE `Outputs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ScheduleTypes`
--

DROP TABLE IF EXISTS `ScheduleTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ScheduleTypes` (
  `scheduleType` varchar(32) NOT NULL,
  `STenabled` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`scheduleType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ScheduleTypes`
--

LOCK TABLES `ScheduleTypes` WRITE;
/*!40000 ALTER TABLE `ScheduleTypes` DISABLE KEYS */;
INSERT INTO `ScheduleTypes` VALUES ('Manual',1),('Periodic',1),('Sensor',1),('Time',1);
/*!40000 ALTER TABLE `ScheduleTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ScheduledEventLog`
--

DROP TABLE IF EXISTS `ScheduledEventLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ScheduledEventLog` (
  `logID` int(11) NOT NULL AUTO_INCREMENT,
  `scheduleID` int(11) NOT NULL,
  `logTime` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`logID`),
  KEY `scheduleID` (`scheduleID`),
  CONSTRAINT `ScheduledEventLog_ibfk_1` FOREIGN KEY (`scheduleID`) REFERENCES `Schedules` (`scheduleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ScheduledEventLog`
--

LOCK TABLES `ScheduledEventLog` WRITE;
/*!40000 ALTER TABLE `ScheduledEventLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `ScheduledEventLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Schedules`
--

DROP TABLE IF EXISTS `Schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Schedules` (
  `scheduleID` int(11) NOT NULL AUTO_INCREMENT,
  `scheduleType` varchar(32) NOT NULL,
  `eventID` int(11) DEFAULT NULL,
  `sensorID` int(11) DEFAULT NULL,
  `sensorValue` int(11) DEFAULT NULL,
  `outputID` int(11) DEFAULT NULL,
  `outputValue` int(11) DEFAULT NULL,
  `scheduleComparator` varchar(1) DEFAULT NULL,
  `eventTriggerTime` time DEFAULT NULL,
  `eventDuration` int(11) DEFAULT NULL,
  `eventInterval` int(11) DEFAULT NULL,
  `scheduleStartDate` date DEFAULT NULL,
  `scheduleStopDate` date DEFAULT NULL,
  `Senabled` tinyint(1) NOT NULL DEFAULT 1,
  `addedBy` varchar(32) DEFAULT NULL,
  `addedDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `disabledBy` varchar(32) DEFAULT NULL,
  `modifiedDate` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `parameter1` varchar(4096) DEFAULT NULL,
  PRIMARY KEY (`scheduleID`),
  KEY `outputID` (`outputID`),
  KEY `sensorID` (`sensorID`),
  KEY `eventID` (`eventID`),
  KEY `scheduleType` (`scheduleType`),
  KEY `addedBy` (`addedBy`),
  KEY `disabledBy` (`disabledBy`),
  CONSTRAINT `Schedules_ibfk_1` FOREIGN KEY (`outputID`) REFERENCES `Outputs` (`outputID`),
  CONSTRAINT `Schedules_ibfk_2` FOREIGN KEY (`sensorID`) REFERENCES `Sensors` (`sensorID`),
  CONSTRAINT `Schedules_ibfk_3` FOREIGN KEY (`eventID`) REFERENCES `Events` (`eventID`),
  CONSTRAINT `Schedules_ibfk_4` FOREIGN KEY (`scheduleType`) REFERENCES `ScheduleTypes` (`scheduleType`),
  CONSTRAINT `Schedules_ibfk_5` FOREIGN KEY (`addedBy`) REFERENCES `Users` (`username`),
  CONSTRAINT `Schedules_ibfk_6` FOREIGN KEY (`disabledBy`) REFERENCES `Users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Schedules`
--

LOCK TABLES `Schedules` WRITE;
/*!40000 ALTER TABLE `Schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `Schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorData`
--

DROP TABLE IF EXISTS `SensorData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SensorData` (
  `readingID` int(11) NOT NULL AUTO_INCREMENT,
  `sensorID` int(11) NOT NULL,
  `data` decimal(12,7) DEFAULT NULL,
  `logTime` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`readingID`),
  KEY `sensorID` (`sensorID`),
  CONSTRAINT `SensorData_ibfk_1` FOREIGN KEY (`sensorID`) REFERENCES `Sensors` (`sensorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorData`
--

LOCK TABLES `SensorData` WRITE;
/*!40000 ALTER TABLE `SensorData` DISABLE KEYS */;
/*!40000 ALTER TABLE `SensorData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorTypes`
--

DROP TABLE IF EXISTS `SensorTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SensorTypes` (
  `sensorType` varchar(32) NOT NULL,
  `STenabled` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`sensorType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorTypes`
--

LOCK TABLES `SensorTypes` WRITE;
/*!40000 ALTER TABLE `SensorTypes` DISABLE KEYS */;
INSERT INTO `SensorTypes` VALUES ('CarbonDioxide',0),('Humidity',1),('Pressure',1),('Temperature',1);
/*!40000 ALTER TABLE `SensorTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sensors`
--

DROP TABLE IF EXISTS `Sensors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Sensors` (
  `sensorID` int(11) NOT NULL AUTO_INCREMENT,
  `sensorModel` varchar(64) NOT NULL,
  `sensorType` varchar(32) NOT NULL,
  `sensorLocation` varchar(64) NOT NULL,
  `sensorUnits` varchar(16) DEFAULT NULL,
  `SSenabled` tinyint(1) NOT NULL DEFAULT 1,
  `sensorHardwareID` int(11) NOT NULL,
  `sensorProtocol` varchar(32) DEFAULT NULL,
  `sensorAddress` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`sensorID`),
  KEY `sensorType` (`sensorType`),
  CONSTRAINT `Sensors_ibfk_1` FOREIGN KEY (`sensorType`) REFERENCES `SensorTypes` (`sensorType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sensors`
--

LOCK TABLES `Sensors` WRITE;
/*!40000 ALTER TABLE `Sensors` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sensors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `username` varchar(32) NOT NULL,
  `passhash` char(60) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('SYSTEM','SYSTEM',NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-11 23:31:27
