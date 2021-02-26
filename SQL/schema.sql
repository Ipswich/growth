START TRANSACTION;

DROP DATABASE IF EXISTS `growth`;
CREATE DATABASE `growth`;
USE `growth`;

CREATE TABLE Users (
  username VARCHAR(32) NOT NULL,
  passhash CHAR(60) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (username)
);

CREATE TABLE OutputTypes (
  outputTypeID INT NOT NULL AUTO_INCREMENT,
  outputType VARCHAR(32) NOT NULL,
  outputPWM BOOLEAN NOT NULL DEFAULT 0,
  outputPWMInversion BOOLEAN NOT NULL DEFAULT 0,
  OTenabled BOOLEAN NOT NULL DEFAULT 1,
  PRIMARY KEY (outputTypeID)
);

CREATE TABLE Outputs (
  outputID INT NOT NULL AUTO_INCREMENT,
  outputTypeID INT NOT NULL,
  outputName VARCHAR(64) NOT NULL,
  outputDescription VARCHAR(128),
  Oenabled BOOLEAN NOT NULL DEFAULT 1,
  outputOrder INT DEFAULT 0,
  PRIMARY KEY (outputID),
  FOREIGN KEY (outputTypeID) REFERENCES OutputTypes(outputTypeID)
);

CREATE TABLE SensorTypes (
  sensorType VARCHAR(32) NOT NULL,
  STenabled BOOLEAN NOT NULL DEFAULT 1,
  PRIMARY KEY (sensorType)
);

CREATE TABLE Sensors (
  sensorID INT NOT NULL AUTO_INCREMENT,
  sensorModel VARCHAR(64) NOT NULL,
  sensorType VARCHAR(32) NOT NULL,
  sensorLocation VARCHAR(64) NOT NULL,
  sensorUnits VARCHAR(16) DEFAULT NULL,
  SSenabled BOOLEAN NOT NULL DEFAULT 1,
  sensorHardwareID INT NOT NULL,
  sensorProtocol VARCHAR(32) DEFAULT NULL,
  sensorAddress VARCHAR(64) DEFAULT NULL,
  PRIMARY KEY (sensorID),
  FOREIGN KEY (sensorType) REFERENCES SensorTypes(sensorType)
);

CREATE TABLE SensorData (
  readingID INT NOT NULL AUTO_INCREMENT,
  sensorID INT NOT NULL,
  data DECIMAL(12, 7),
  logTime TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
  PRIMARY KEY (readingID),
  FOREIGN KEY (sensorID) REFERENCES Sensors(sensorID)
);

CREATE TABLE Events (
  eventID INT NOT NULL AUTO_INCREMENT,
  eventName VARCHAR(64) NOT NULL,
  eventDescription VARCHAR(128),
  Eenabled BOOLEAN NOT NULL DEFAULT 1,
  PRIMARY KEY (eventID)
);

CREATE TABLE ScheduleTypes(
  scheduleType VARCHAR(32) NOT NULL,
  STenabled BOOLEAN NOT NULL DEFAULT 1,
  PRIMARY KEY (scheduleType)
);

CREATE TABLE Schedules (
  scheduleID INT NOT NULL AUTO_INCREMENT,
  scheduleType VARCHAR(32) NOT NULL,
  eventID INT DEFAULT NULL,
  sensorID INT DEFAULT NULL,
  sensorValue INT DEFAULT NULL,
  outputID INT DEFAULT NULL,
  outputValue INT DEFAULT NULL,
  scheduleComparator VARCHAR(1) DEFAULT NULL,
  eventTriggerTime TIME DEFAULT NULL,
  eventDuration INT DEFAULT NULL,
  eventInterval INT DEFAULT NULL,
  scheduleStartDate DATE DEFAULT NULL,
  scheduleStopDate DATE DEFAULT NULL,
  Senabled BOOLEAN NOT NULL DEFAULT 1,
  addedBy VARCHAR(32) DEFAULT NULL,
  addedDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
  disabledBy VARCHAR(32) DEFAULT NULL,
  modifiedDate TIMESTAMP NULL DEFAULT NULL ON UPDATE LOCALTIMESTAMP,
  parameter1 VARCHAR(4096) DEFAULT NULL,
  PRIMARY KEY (scheduleID),
  FOREIGN KEY (outputID) REFERENCES Outputs(outputID),
  FOREIGN KEY (sensorID) REFERENCES Sensors(sensorID),
  FOREIGN KEY (eventID) REFERENCES Events(eventID),
  FOREIGN KEY (scheduleType) REFERENCES ScheduleTypes(scheduleType),
  FOREIGN KEY (addedBy) REFERENCES Users(username),
  FOREIGN KEY (disabledBy) REFERENCES Users(username)
);

CREATE TABLE ScheduledEventLog (
  logID INT NOT NULL AUTO_INCREMENT,
  scheduleID INT NOT NULL,
  logTime TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
  PRIMARY KEY (logID),
  FOREIGN KEY (scheduleID) REFERENCES Schedules(scheduleID)
);

#############################################
############# STORED PROCEDURES #############
#############################################

#############OUTPUT HARDWARE#############

##Insert new outputType
DELIMITER $$
CREATE PROCEDURE `addNewOutputType` (IN `p_type` VARCHAR(32), IN `p_PWM` BOOLEAN, IN `p_PWMInversion` BOOLEAN, IN `p_enabled` BOOLEAN)
MODIFIES SQL DATA
  INSERT INTO OutputTypes (outputType, outputPWM, outputPWMInversion, OTenabled) VALUES (p_type, p_PWM, p_PWMInversion, p_enabled)
  $$
DELIMITER ;

##Get outputTypes
DELIMITER $$
CREATE PROCEDURE `getAllOutputTypes`()
READS SQL DATA
  SELECT * FROM OutputTypes
  ORDER BY outputType DESC
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `getEnabledOutputTypes`()
READS SQL DATA
  SELECT * FROM OutputTypes WHERE OTenabled = 1
  ORDER BY outputType DESC
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `DisableOutputType`(IN `p_outputTypeID` INT)
MODIFIES SQL DATA
  UPDATE OutputTypes SET OTenabled = 0 WHERE outputTypeID = p_outputTypeID
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `UpdateOutputType`(IN `p_outputTypeID` INT, IN `p_type` VARCHAR(32), IN `p_pwm` TINYINT, IN `p_pwmInversion` TINYINT)
MODIFIES SQL DATA
  UPDATE OutputTypes SET outputType = p_type, outputPWM = p_pwm, outputPWMInversion = p_pwmInversion WHERE outputTypeID = p_outputTypeID
  $$
DELIMITER ;

##Insert new Output
DELIMITER $$
CREATE PROCEDURE `addNewOutput` (IN `p_type` INT, IN `p_name` VARCHAR(64), IN `p_description` VARCHAR(128), IN `p_order` INT)
MODIFIES SQL DATA
	INSERT INTO Outputs (outputTypeID, outputName, outputDescription, outputOrder) VALUES (p_type, p_name, p_description, p_order);
$$
DELIMITER ;

##Get Outputs
DELIMITER $$
CREATE PROCEDURE `getAllOutputs`()
READS SQL DATA
  SELECT * FROM Outputs
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `getEnabledOutputs`()
READS SQL DATA
  SELECT * FROM Outputs LEFT JOIN OutputTypes ON Outputs.outputTypeID=OutputTypes.outputTypeID WHERE Oenabled = 1
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `getEnabledOrderedOutputs`()
READS SQL DATA
  SELECT * FROM Outputs LEFT JOIN OutputTypes ON Outputs.outputTypeID=OutputTypes.outputTypeID WHERE Oenabled = 1 ORDER BY outputOrder = 0, outputOrder;
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `DisableOutput`(IN `p_outputID` INT)
MODIFIES SQL DATA
  UPDATE Outputs SET Oenabled = 0 WHERE outputID = p_outputID
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `UpdateOutput`(IN `p_outputID` INT, IN `p_type` INT, IN `p_name` VARCHAR(64), IN `p_description` VARCHAR(128), IN `p_order` INT)
MODIFIES SQL DATA
  UPDATE Outputs SET outputTypeID = p_type, outputName = p_name, outputDescription = p_description, outputOrder = p_order WHERE outputID = p_outputID
  $$
DELIMITER ;

#############SENSOR HARDWARE#############

##Insert new sensorType
DELIMITER $$
CREATE PROCEDURE `addNewSensorType` (IN `p_type` VARCHAR(32), IN `p_enabled` BOOLEAN)
MODIFIES SQL DATA
  INSERT INTO SensorTypes (sensorType, STenabled) VALUES (p_type, p_enabled)
  $$
DELIMITER ;

##Get sensorTypes
DELIMITER $$
CREATE PROCEDURE `getAllSensorTypes`()
READS SQL DATA
  SELECT * FROM SensorTypes
  ORDER BY sensorType DESC
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `getEnabledSensorTypes`()
READS SQL DATA
  SELECT * FROM SensorTypes WHERE STenabled = 1
  ORDER BY sensorType DESC
  $$
DELIMITER ;

##Insert new sensor
DELIMITER $$
CREATE PROCEDURE `addNewSensor` (IN `p_model` VARCHAR(64), IN `p_type` VARCHAR(32), IN `p_location` VARCHAR(64), IN `p_units` VARCHAR(16), IN `p_hardwareID` INT, IN `p_sensorProtocol` VARCHAR(32), IN `p_address` VARCHAR(64))
MODIFIES SQL DATA
  INSERT INTO Sensors (sensorModel, sensorType, sensorLocation, sensorUnits, sensorHardwareID, sensorProtocol, sensorAddress) VALUES (p_model, p_type, p_location, p_units, p_hardwareID, p_sensorProtocol, p_address)
  $$
DELIMITER ;

##Get sensor data for ALL sensors
DELIMITER $$
CREATE PROCEDURE `getAllSensors`()
READS SQL DATA
  SELECT * FROM Sensors;
$$
DELIMITER ;

##Get sensor data for all ENABLED sensors
DELIMITER $$
CREATE PROCEDURE `getEnabledSensors`()
READS SQL DATA
  SELECT * FROM Sensors WHERE SSenabled = 1
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

##Update sensor 
DELIMITER $$
CREATE PROCEDURE `UpdateSensor`(IN `p_sensorID` INT, IN `p_model` VARCHAR(64), IN `p_type` VARCHAR(32), IN `p_location` VARCHAR(64), IN `p_units` VARCHAR(16), IN `p_hardwareID` INT, IN `p_protocol` VARCHAR(32), IN `p_address` VARCHAR(64))
MODIFIES SQL DATA
  UPDATE Sensors SET sensorModel = p_model, sensorType = p_type, sensorLocation = p_location, sensorUnits = p_units, sensorHardwareID = p_hardwareID, sensorProtocol = p_protocol, sensorAddress = p_address WHERE sensorID = p_sensorID
$$
DELIMITER $$

##Update sensor Address
DELIMITER $$
CREATE PROCEDURE `updateSensorAddress`(IN `p_sensorAddress` VARCHAR(64), IN `p_sensorID` INT)
MODIFIES SQL DATA
  UPDATE Sensors SET sensorAddress = p_sensorAddress WHERE sensorID = p_sensorID
$$
DELIMITER $$

##Disable Sensor
DELIMITER $$
CREATE PROCEDURE `DisableSensor`(IN `p_sensorID` INT)
MODIFIES SQL DATA
  UPDATE Sensors SET SSenabled = 0 WHERE sensorID = p_sensorID
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
SELECT sensorID, data, logTime
FROM SensorData s1
WHERE logTime = (SELECT MAX(logTime) FROM SensorData s2 WHERE s1.sensorID = s2.sensorID)
ORDER BY sensorID, logTime;
##Get most recent readings from ALL sensors
DELIMITER $$
CREATE PROCEDURE `getSensorLastReadings`()
  READS SQL DATA
  SELECT s.sensorID, s.sensorModel, s.sensorType, s.sensorLocation, s.SSenabled, data, s.sensorUnits, d.logTime
  FROM Sensors s
  JOIN (
    SELECT sensorID, data, logTime
		FROM SensorData s1
		WHERE logTime = (SELECT MAX(logTime) FROM SensorData s2 WHERE s1.sensorID = s2.sensorID)
  ) AS d ON s.sensorID=d.sensorID
  WHERE SSenabled = 1
  GROUP BY sensorID
  ORDER BY sensorType DESC, sensorID ASC
$$
DELIMITER ;

##Get sensor readings from past variable hours
DELIMITER $$
CREATE PROCEDURE `getSensorLastReadingsByHours` (IN `p_hours` INT)
  READS SQL DATA
  SELECT s.sensorID, s.sensorModel, s.sensorType, s.sensorLocation, s.SSenabled, data, s.sensorUnits, logTime
  FROM Sensors s
  JOIN (
    SELECT sensorID, data, logTime
		FROM SensorData
		WHERE logTime > DATE_SUB(LOCALTIMESTAMP(), INTERVAL p_hours HOUR)
  ) AS d ON s.sensorID=d.sensorID
  WHERE SSenabled = 1
  ORDER BY sensorType DESC, sensorID ASC
$$
DELIMITER ;

#############EVENTS#############

##Insert new event
DELIMITER $$
CREATE PROCEDURE `addNewEvent` (IN `p_name` VARCHAR(64), IN `p_description` VARCHAR(128), IN `p_enabled` BOOLEAN)
MODIFIES SQL DATA
    INSERT INTO Events (eventName, eventDescription, Eenabled) VALUES (p_name, p_description, p_enabled);
$$
DELIMITER ;

##Get all events
DELIMITER $$
CREATE PROCEDURE `getAllEvents` ()
READS SQL DATA
  SELECT * FROM Events;
$$
DELIMITER ;

##Get all events
DELIMITER $$
CREATE PROCEDURE `getEnabledEvents` ()
READS SQL DATA
  SELECT * FROM Events WHERE Eenabled = 1
  $$
DELIMITER ;

#############SCHEDULES#############

##Insert new schedule type
DELIMITER $$
CREATE PROCEDURE `addNewScheduleType` (IN `p_type` VARCHAR(32), IN `p_enabled` BOOLEAN)
MODIFIES SQL DATA
  INSERT INTO ScheduleTypes (scheduleType, STenabled) VALUES (p_type, p_enabled);
$$
DELIMITER ;

##Get all schedule types
DELIMITER $$
CREATE PROCEDURE `getAllScheduleTypes` ()
READS SQL DATA
  SELECT * FROM ScheduleTypes
  ORDER BY scheduleType DESC
$$
DELIMITER ;

##Get enabled schedule Types
DELIMITER $$
CREATE PROCEDURE `getEnabledScheduleTypes` ()
READS SQL DATA
  SELECT * FROM ScheduleTypes WHERE STenabled = 1
  ORDER BY scheduleType DESC
  $$
DELIMITER ;

##Insert new schedule
DELIMITER $$
CREATE PROCEDURE `addNewSchedule` (
  IN `p_scheduleType` VARCHAR(32),
  IN `p_eventID` INT,
  IN `p_sensorID` INT,
  IN `p_sensorValue` INT,
  IN `p_outputID` INT,
  IN `p_outputValue` INT,
  IN `p_scheduleComparator` VARCHAR(1),
  IN `p_eventTriggerTime` TIME,
  IN `p_eventDuration` INT,
  IN `p_eventInterval` INT,
  IN `p_scheduleStartDate` DATE,
  IN `p_scheduleStopDate` DATE,
  IN `p_enabled` BOOLEAN,
  IN `p_addedBy` VARCHAR(32),
  IN `p_disabledBy` VARCHAR(32),
  IN `p_parameter1` VARCHAR(4096))
MODIFIES SQL DATA
INSERT INTO Schedules (
  scheduleType,
  eventID,
  sensorID,
  sensorValue,
  outputID,
  outputValue,
  scheduleComparator,
  eventTriggerTime,
  eventDuration,
  eventInterval,
  scheduleStartDate,
  scheduleStopDate,
  Senabled,
  addedBy,
  disabledBy,
  parameter1)
 VALUES (
   p_scheduleType,
   p_eventID,
   p_sensorID,
   p_sensorValue,
   p_outputID,
   p_outputValue,
   p_scheduleComparator,
   p_eventTriggerTime,
   p_eventDuration,
   p_eventInterval,
   p_scheduleStartDate,
   p_scheduleStopDate,
   p_enabled,
   p_addedBy,
   p_disabledBy,
   p_parameter1);
$$
DELIMITER ;

##Get schedule
DELIMITER $$
CREATE PROCEDURE `getAllSchedules` ()
READS SQL DATA
  SELECT * FROM Schedules s
  JOIN Events AS e ON s.eventID=e.eventID
  LEFT JOIN Sensors AS n on s.sensorID=n.sensorID
  JOIN Outputs AS o on s.outputID=o.outputID
  ORDER BY eventTriggerTime IS NULL
$$
DELIMITER ;

##Get enabled schedule
DELIMITER $$
CREATE PROCEDURE `getEnabledSchedules` ()
READS SQL DATA
  SELECT * FROM Schedules s
  JOIN Events AS e ON s.eventID=e.eventID
  LEFT JOIN Sensors AS n on s.sensorID=n.sensorID
  JOIN Outputs AS o on s.outputID=o.outputID
  WHERE s.Senabled = 1
  ORDER BY eventTriggerTime IS NULL, outputName DESC
$$
DELIMITER ;

##Get enabled live schedule
DELIMITER $$
CREATE PROCEDURE `getEnabledLiveSchedules` ()
READS SQL DATA
SELECT * FROM Schedules s
JOIN Events AS e ON s.eventID=e.eventID
LEFT JOIN Sensors AS n on s.sensorID=n.sensorID
JOIN Outputs AS o on s.outputID=o.outputID
JOIN (SELECT outputPWM, outputType, outputTypeID from OutputTypes) AS ot on o.outputTypeID=ot.outputTypeID
JOIN (SELECT username, email FROM Users) as u on s.addedBy=u.username
WHERE s.Senabled = 1
  AND ((LOCALTIMESTAMP <= s.scheduleStopDate OR s.scheduleStopDate IS NULL) AND (LOCALTIMESTAMP >= s.scheduleStartDate OR s.scheduleStartDate IS NULL))
ORDER BY -eventTriggerTime DESC, outputName DESC
$$
DELIMITER ;

##Get schedule by ID
DELIMITER $$
CREATE PROCEDURE `getScheduleByID` (IN `p_id` INT)
READS SQL DATA
SELECT * FROM Schedules
WHERE ScheduleID = p_id
$$
DELIMITER ;

##Disable Schedule by
DELIMITER $$
CREATE PROCEDURE `DisableSchedule` (IN `p_id` INT, `p_user` VARCHAR(32))
MODIFIES SQL DATA
UPDATE Schedules
SET SEnabled = 0, disabledBy = p_user
WHERE ScheduleID = p_id
$$
DELIMITER ;

#############Users##############

##Add New User
DELIMITER $$
CREATE PROCEDURE `addNewUser` (IN `p_username` VARCHAR(32), IN `p_hash` VARCHAR(60), in `p_email` VARCHAR(255))
MODIFIES SQL DATA
  INSERT INTO Users (username, passhash, email) VALUES (p_username, p_hash, p_email)
$$
DELIMITER ;

##Get user
DELIMITER $$
CREATE PROCEDURE `getUser` (IN `p_username` VARCHAR(32))
READS SQL DATA
  SELECT * FROM Users WHERE Users.username = p_username
$$
DELIMITER ;

##Get all users
DELIMITER $$
CREATE PROCEDURE `getAllUsers` ()
READS SQL DATA
  SELECT username FROM Users
$$
DELIMITER ;

#############LOGGING#############

##Log event
DELIMITER $$
CREATE PROCEDURE `logScheduledEvent` (IN `p_scheduleID` INT)
MODIFIES SQL DATA
  INSERT INTO ScheduledEventLog (scheduleID) VALUES (p_scheduleID);
$$
DELIMITER ;



COMMIT;
