DROP DATABASE IF EXISTS Growth;
CREATE DATABASE Growth;
USE Growth;

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

CREATE TABLE Temperature (
  readingID INT NOT NULL AUTO_INCREMENT,
  sensorID INT NOT NULL,
  data DECIMAL(10, 7),
  logTime TIMESTAMP DEFAULT LOCALTIMESTAMP,
  PRIMARY KEY (readingID),
  FOREIGN KEY (sensorID) REFERENCES Sensors(sensorID)
);

CREATE TABLE Pressure (
  readingID INT NOT NULL AUTO_INCREMENT,
  sensorID INT NOT NULL,
  data DECIMAL(10, 6),
  logTime TIMESTAMP DEFAULT LOCALTIMESTAMP,
  PRIMARY KEY (readingID),
  FOREIGN KEY (sensorID) REFERENCES Sensors(sensorID)
);

CREATE TABLE Humidity (
  readingID INT NOT NULL AUTO_INCREMENT,
  sensorID INT NOT NULL,
  data DECIMAL(10, 7),
  logTime TIMESTAMP DEFAULT LOCALTIMESTAMP,
  PRIMARY KEY (readingID),
  FOREIGN KEY (sensorID) REFERENCES Sensors(sensorID)
);

CREATE TABLE CarbonDioxide (
  readingID INT NOT NULL AUTO_INCREMENT,
  sensorID INT NOT NULL,
  data decimal(10, 6),
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
CREATE PROCEDURE `getSensorTypes`()
READS SQL DATA
  SELECT * FROM SensorTypes$$
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

##Get sensor data for temperature sensors
DELIMITER $$
CREATE PROCEDURE `getTemperatureSensors`()
READS SQL DATA
  SELECT DISTINCT Sensors.sensorID, Sensors.sensorModel, Sensors.sensorLocation, Sensors.sensorUnits
  FROM Sensors
  JOIN Temperature
  ON Sensors.sensorID = Temperature.sensorID
$$
DELIMITER ;

##Get sensor data for pressure sensors
DELIMITER $$
CREATE PROCEDURE `getPressureSensors`()
READS SQL DATA
  SELECT DISTINCT Sensors.sensorID, Sensors.sensorModel, Sensors.sensorLocation, Sensors.sensorUnits
  FROM Sensors
  JOIN Pressure
  ON Sensors.sensorID = Pressure.sensorID
$$
DELIMITER ;

##Get sensor data for humidity sensors
DELIMITER $$
CREATE PROCEDURE `getHumiditySensors`()
READS SQL DATA
  SELECT DISTINCT Sensors.sensorID, Sensors.sensorModel, Sensors.sensorLocation, Sensors.sensorUnits
  FROM Sensors
  JOIN Humidity
  ON Sensors.sensorID = Humidity.sensorID
$$
DELIMITER ;

##Get sensor data for carbon dioxide sensors
DELIMITER $$
CREATE PROCEDURE `getCarbonDioxideSensors`()
READS SQL DATA
  SELECT DISTINCT Sensors.sensorID, Sensors.sensorModel, Sensors.sensorLocation, Sensors.sensorUnits
  FROM Sensors
  JOIN CarbonDioxide
  ON Sensors.sensorID = CarbonDioxide.sensorID
$$
DELIMITER ;

#############SENSOR READINGS#############

##INSERT NEW READINGS##
##Insert new temperature
DELIMITER $$
CREATE PROCEDURE `addTemperatureReading` (IN `p_sensorID` INT, IN `p_data` decimal(10, 7))
MODIFIES SQL DATA
  INSERT INTO Temperature (sensorID, data) VALUES (p_sensorID, p_data)$$
DELIMITER ;

##Insert new pressure
DELIMITER $$
CREATE PROCEDURE `addPressureReading` (IN `p_sensorID` INT, IN `p_data` decimal(10, 6))
MODIFIES SQL DATA
  INSERT INTO Pressure (sensorID, data) VALUES (p_sensorID, p_data)$$
DELIMITER ;

##Insert new humidity
DELIMITER $$
CREATE PROCEDURE `addHumidityReading` (IN `p_sensorID` INT, IN `p_data` decimal(10, 7))
MODIFIES SQL DATA
  INSERT INTO Humidity (sensorID, data) VALUES (p_sensorID, p_data)$$
DELIMITER ;

##Insert new carbon dioxide
DELIMITER $$
CREATE PROCEDURE `addCarbonDioxideReading` (IN `p_sensorID` INT, IN `p_data` decimal(10, 6))
MODIFIES SQL DATA
  INSERT INTO CarbonDioxide (sensorID, data) VALUES (p_sensorID, p_data)$$
DELIMITER ;

##GET OLD READINGS##
##Get most recent readings from ALL sensors
DELIMITER $$
CREATE PROCEDURE `getSensorLastReadings`()
  READS SQL DATA
  SELECT s.sensorID, s.sensorModel, s.sensorType, s.sensorLocation, data, s.sensorUnits, logTime
  FROM Sensors s
  JOIN (
    SELECT sensorID, data, MAX(logTime) AS logTime
    FROM Temperature
    UNION
    SELECT sensorID, data, MAX(logTime) AS logTime
    FROM Pressure
    UNION
    SELECT sensorID, data, MAX(logTime) AS logTime
    FROM Humidity
   	UNION
    SELECT sensorID, data, MAX(logTime) AS logTime
    FROM CarbonDioxide
  ) AS d ON s.sensorID=d.sensorID
  ORDER BY sensorType ASC, sensorID DESC
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
    FROM Temperature
    UNION
    SELECT sensorID, data, logTime
    FROM Pressure
    UNION
    SELECT sensorID, data, logTime
    FROM Humidity
   	UNION
    SELECT sensorID, data, logTime
    FROM CarbonDioxide
  ) AS d ON s.sensorID=d.sensorID AND d.logTime > DATE_SUB(logTime, INTERVAL p_hours HOUR)
  ORDER BY sensorType ASC, sensorID DESC
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
