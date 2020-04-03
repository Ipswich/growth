DROP DATABASE IF EXISTS `growth-dev`;
CREATE DATABASE `growth-dev`;
USE `growth-dev`;

CREATE TABLE Users (
  username VARCHAR(32) NOT NULL,
  passhash CHAR(60) NOT NULL,
  lastLogin TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (username)
);

CREATE TABLE SensorTypes(
  sensorType VARCHAR(32) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT 1,
  PRIMARY KEY (sensorType)
);

CREATE TABLE Sensors (
  sensorID INT NOT NULL AUTO_INCREMENT,
  sensorModel VARCHAR(64) NOT NULL,
  sensorType VARCHAR(32) NOT NULL,
  sensorLocation VARCHAR(64) NOT NULL,
  sensorUnits VARCHAR(16) DEFAULT NULL,
  PRIMARY KEY (sensorID),
  FOREIGN KEY (sensorType) REFERENCES SensorTypes(sensorType)
);

CREATE TABLE SensorData (
  readingID INT NOT NULL AUTO_INCREMENT,
  sensorID INT NOT NULL,
  data DECIMAL(12, 7),
  logTime TIMESTAMP DEFAULT LOCALTIMESTAMP,
  PRIMARY KEY (readingID),
  FOREIGN KEY (sensorID) REFERENCES Sensors(sensorID)
);

CREATE TABLE EventTypes(
  eventType VARCHAR(32) NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT 1,
  PRIMARY KEY (eventType)
);

CREATE TABLE Events (
  eventID INT NOT NULL AUTO_INCREMENT,
  eventName VARCHAR(64) NOT NULL,
  eventType VARCHAR(32) NOT NULL,
  eventDescription VARCHAR(128),
  PRIMARY KEY (eventID),
  FOREIGN KEY (eventType) REFERENCES EventTypes(eventType)
);

CREATE TABLE Schedules (
  scheduleID INT NOT NULL AUTO_INCREMENT,
  eventID INT NOT NULL,
  parameter1 INT DEFAULT NULL,
  parameter2 INT DEFAULT NULL,
  parameter3 INT DEFAULT NULL,
  parameter4 INT DEFAULT NULL,
  parameter5 INT DEFAULT NULL,
  parameter6 INT DEFAULT NULL,
  parameter7 INT DEFAULT NULL,
  parameter8 INT DEFAULT NULL,
  parameter9 INT DEFAULT NULL,
  startTime TIME DEFAULT 0,
  stopTime TIME DEFAULT 0,
  startDate DATE DEFAULT 0,
  stopDate DATE DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT 1,
  PRIMARY KEY (scheduleID),
  FOREIGN KEY (eventID) REFERENCES Events(eventID)
);

#############################################
############# STORED PROCEDURES #############
#############################################

#############SENSOR HARDWARE#############

##Insert new sensorType
DELIMITER $$
CREATE PROCEDURE `addNewSensorType` (IN `p_type` VARCHAR(32), IN `p_enabled` BOOLEAN)
MODIFIES SQL DATA
  INSERT INTO SensorTypes (sensorType, enabled) VALUES (p_type, p_enabled)$$
DELIMITER ;

##Get sensorTypes
DELIMITER $$
CREATE PROCEDURE `getAllSensorTypes`()
READS SQL DATA
  SELECT * FROM SensorTypes$$
  ORDER BY sensorType DESC
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `getEnabledSensorTypes`()
READS SQL DATA
  SELECT * FROM SensorTypes WHERE enabled = 1$$
  ORDER BY sensorType DESC
DELIMITER ;

##Insert new sensor
DELIMITER $$
CREATE PROCEDURE `addNewSensor` (IN `p_model` VARCHAR(64), IN `p_type` VARCHAR(32), IN `p_location` VARCHAR(64), IN `p_units` VARCHAR(16))
MODIFIES SQL DATA
sp:BEGIN
  DECLARE result INT DEFAULT 0;
  SET result = (SELECT COUNT(sensorType) FROM SensorTypes WHERE sensorType = p_type);
  IF result = 0 THEN
    LEAVE sp;
  ELSE
	INSERT INTO Sensors (sensorModel, sensorType, sensorLocation, sensorUnits) VALUES (p_model, p_type, p_location, p_units);
  END IF;
END;
$$
DELIMITER ;

##Get sensor data for ALL sensors
DELIMITER $$
CREATE PROCEDURE `getAllSensors`()
READS SQL DATA
  SELECT * FROM Sensors;
$$
DELIMITER ;

##Get sensor data for sensors
DELIMITER $$
CREATE PROCEDURE `getSensorDataByType`(IN `p_type` VARCHAR(32))
READS SQL DATA
sp:BEGIN
  DECLARE result INT DEFAULT 0;
  SET result = (SELECT COUNT(sensorType) FROM SensorTypes WHERE sensorType = p_type);
  IF result = 0 THEN
    LEAVE sp;
  ELSE
    (SELECT DISTINCT Sensors.sensorID, Sensors.sensorModel, Sensors.type, Sensors.sensorLocation, Sensors.sensorUnits);
  END IF;
END;
$$
DELIMITER ;


#############SENSOR READINGS#############

##INSERT NEW READINGS##
DELIMITER $$
CREATE PROCEDURE `addSensorReading` (IN `p_sensorID` INT, IN `p_data` decimal(12, 7))
MODIFIES SQL DATA
  INSERT INTO SensorData (sensorID, data) VALUES (p_sensorID, p_data)$$
DELIMITER ;

##GET OLD READINGS##
##Get most recent readings from ALL sensors
DELIMITER $$
CREATE PROCEDURE `getSensorLastReadings`()
  READS SQL DATA
  SELECT s.sensorID, s.sensorModel, s.sensorType, s.sensorLocation, data, s.sensorUnits, MAX(logTime) AS logTime
  FROM Sensors s
  JOIN (
    SELECT sensorID, data, logTime
    FROM SensorData
  ) AS d ON s.sensorID=d.sensorID
  GROUP BY sensorID
  ORDER BY sensorType DESC, sensorID DESC
$$
DELIMITER ;

##Get sensor readings from past variable hours
DELIMITER $$
CREATE PROCEDURE `getSensorLastReadingsByHours` (IN `p_hours` INT)
  READS SQL DATA
  SELECT s.sensorID, s.sensorModel, s.sensorType, s.sensorLocation, data, s.sensorUnits, logTime
  FROM Sensors s
  JOIN (
    SELECT sensorID, data, logTime
    FROM SensorData
  ) AS d ON s.sensorID=d.sensorID AND d.logTime > DATE_SUB(logTime, INTERVAL p_hours HOUR)
  ORDER BY sensorType DESC, sensorID DESC
$$
DELIMITER ;

#############EVENTS#############

##Insert new event type
DELIMITER $$
CREATE PROCEDURE `addNewEventType` (IN `p_type` VARCHAR(32), IN `p_enabled` BOOLEAN)
MODIFIES SQL DATA
  INSERT INTO EventTypes (eventType, enabled) VALUES (p_type, p_enabled);
$$
DELIMITER ;

##Insert new event
DELIMITER $$
CREATE PROCEDURE `addNewEvent` (IN `p_name` VARCHAR(64), IN `p_type` VARCHAR(32), IN `p_description` VARCHAR(128))
MODIFIES SQL DATA
sp:BEGIN
  DECLARE result INT DEFAULT 0;
  SET result = (SELECT COUNT(eventType) FROM EventTypes WHERE eventName = p_name);
  IF result = 0 THEN
    LEAVE sp;
  ELSE
    INSERT INTO Events (eventName, eventType, eventDescription) VALUES (p_name, p_type, p_description);
  END IF;
END;
$$
DELIMITER ;
