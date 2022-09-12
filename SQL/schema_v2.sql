START TRANSACTION;

DROP DATABASE IF EXISTS `growth-test`;
CREATE DATABASE `growth-test`;
USE `growth-test`;

## OLD SQL

CREATE TABLE Users (
  username VARCHAR(32) NOT NULL,
  passhash CHAR(60) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (username)
);

CREATE TABLE Sensors (
  sensorID INT NOT NULL AUTO_INCREMENT,
  sensorModel VARCHAR(64) NOT NULL,
  sensorType VARCHAR(32) NOT NULL,
  sensorLocation VARCHAR(64) NOT NULL,
  sensorUnits VARCHAR(16) DEFAULT NULL,
  sensorHardwareID INT NOT NULL,
  sensorProtocol VARCHAR(32) DEFAULT NULL,
  sensorAddress VARCHAR(64) DEFAULT NULL,
  sensorPin INT DEFAULT NULL,
  PRIMARY KEY (sensorID)
);

CREATE TABLE SensorData (
  readingID INT NOT NULL AUTO_INCREMENT,
  sensorID INT NOT NULL,
  data DECIMAL(12, 7),
  logTime TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
  PRIMARY KEY (readingID),
  FOREIGN KEY (sensorID) REFERENCES Sensors(sensorID)
);

CREATE TABLE Outputs (
  outputID INT NOT NULL AUTO_INCREMENT,
  outputName VARCHAR(64) NOT NULL,
  outputType VARCHAR(32) DEFAULT NULL,
  outputDescription VARCHAR(128) DEFAULT NULL,
  outputPWM BOOLEAN NOT NULL DEFAULT 0,
  outputPin INT DEFAULT NULL,
  outputPWMPin INT DEFAULT NULL,
  outputPWMInversion BOOLEAN DEFAULT NULL,
  outputScheduleState BOOLEAN DEFAULT NULL,
  outputScheduleOutputValue INT DEFAULT NULL,
  outputManualState BOOLEAN DEFAULT NULL,
  outputManualOutputValue INT DEFAULT NULL,
  outputController VARCHAR(32) DEFAULT "SCHEDULE",
  outputLastController VARCHAR(32) DEFAULT "SCHEDULE",
  outputUpdatedAt TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  outputOrder INT DEFAULT 0,
  PRIMARY KEY (outputID)
);

CREATE TABLE Days (
  dayID INT NOT NULL AUTO_INCREMENT,
  ## weekday: None = 0, Mon = 1, Tue = 2, Wed = 4, Thu = 8, Fri = 16, Sat = 32, Sun = 64, All = 127 (Bit math for days)
  weekday TINYINT UNSIGNED DEFAULT 127,
  createdBy VARCHAR(32) DEFAULT NULL,
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  PRIMARY KEY (dayID),
  FOREIGN KEY (createdBy) REFERENCES Users(username)
);

#########################
## CONNECTED EVENTS VS SINGLE EVENTS
##### BLOCK EVENTS #####
## python √
## time √
## bound/gradients √
## sensor value/multipoint √
## periodic √
## coordinate light tracker √
## random pwm/duration/# of times √
## probability of event = (ocurrences / (minutes left - (occurrences * (duration + timeout))))
## (BAD) p = o / (m - (o * (d + t)))
## "Smart Intervals"
## randomEventIntervalGenerator = function(event){
##   let timeLeft = event.totalMinutes - (event.occurrences * (event.duration + event.minTimeout)) #time not in events
##   let timeouts = []
##   for (let i = 1; i <= event.ocurrences; i++){
##     let maxTimeout = N - ((event.ocurrences - i) * event.minTimeout);
##     let timeout = N - randInt(event.minTimeout, maxTimeout));
##     timeouts.append(timeout);
##     timeLeft = timeLeft - timeout
##   }
##   return timeouts
## }
## 
## Connected
CREATE TABLE RandomEvents (
  randomEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  startTime TIME NOT NULL,
  stopTime TIME NOT NULL,
  outputID INT NOT NULL,
  outputValue INT NOT NULL,
  ## outputValue = 0 is off
  ## outputValue > 0 is on
  ## outputValue < 0 is random
  occurrences INT CHECK (occurrences != 0),
  ## Negative values are random, not 0
  duration INT CHECK (duration != 0),
  ## Negative values are random, not 0
  minTimeout INT CHECK(minTimeout >= 0),
  ## Greater than or equal to 0
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (randomEventID),
  FOREIGN KEY (outputID) REFERENCES Outputs(outputID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (createdBy) REFERENCES Users(username)
);
## Connected
CREATE TABLE RandomPythonEvents (
  randomPythonEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  startTime TIME NOT NULL,
  stopTime TIME NOT NULL,
  pythonScript VARCHAR(256) NOT NULL,
  occurrences INT NOT NULL,
  ## Negative values are random, not 0
  duration INT NOT NULL,
  ## Negative values are random, not 0
  minTimeout INT NOT NULL,
  ## Greater than or equal to 0
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (randomPythonEventID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (createdBy) REFERENCES Users(username),
  CONSTRAINT is_valid CHECK (
    occurrences != 0
    AND duration != 0
    AND minTimeout >= 0
  )
);
## Connected
CREATE TABLE RecurringEvents (
  recurringEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  ## Both start/stop time NULL is always
  startTime TIME DEFAULT NULL,
  stopTime TIME DEFAULT NULL,
  outputID INT NOT NULL,
  outputValue INT NOT NULL,
  ## outputValue = 0 is off,
  ## outputValue > 0 is on,
  ## outputValue < 0 is random,
  timeoutTime TIMESTAMP NOT NULL,
  repeatTime TIMESTAMP NOT NULL,
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (recurringEventID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (outputID) REFERENCES Outputs(outputID),
  FOREIGN KEY (createdBy) REFERENCES Users(username),
  CONSTRAINT both_filled CHECK (
    (
      startTime IS NULL
      AND stopTime IS NULL
    )
    OR (
      startTime IS NOT NULL
      AND stopTime IS NOT NULL
    )
  )
);
## Connected
CREATE TABLE RecurringPythonEvents (
  recurringPythonEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  ## Both start/stop time NULL is always
  startTime TIME DEFAULT NULL,
  stopTime TIME DEFAULT NULL,
  timeoutTime TIMESTAMP NOT NULL,
  repeatTime TIMESTAMP NOT NULL,
  pythonScript VARCHAR(256) NOT NULL,
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (recurringPythonEventID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (createdBy) REFERENCES Users(username),
  CONSTRAINT both_filled CHECK (
    (
      startTime IS NULL
      AND stopTime IS NULL
    )
    OR (
      startTime IS NOT NULL
      AND stopTime IS NOT NULL
    )
  )
);
## Singular
CREATE TABLE TimeEvents (
  timeEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  triggerTime TIMESTAMP NOT NULL,
  outputID INT NOT NULL,
  outputValue INT NOT NULL,
  ## outputValue = 0 is off,
  ## outputValue > 0 is on,
  ## outputValue < 0 is random,
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (timeEventID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (outputID) REFERENCES Outputs(outputID),
  FOREIGN KEY (createdBy) REFERENCES Users(username)
);
## Singular
## Should get passed all sensor/output data by default
CREATE TABLE PythonTimeEvents (
  pythonTimeEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  triggerTime TIMESTAMP NOT NULL,
  pythonScript VARCHAR(256),
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (pythonTimeEventID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (createdBy) REFERENCES Users(username)
);
## Connected
CREATE TABLE SensorEvents (
  sensorEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  ## Both start/stop time NULL is always
  startTime TIME DEFAULT NULL,
  stopTime TIME DEFAULT NULL,
  outputID INT NOT NULL,
  outputValue INT NOT NULL,
  sensorID INT NOT NULL,
  triggerValues JSON NOT NULL,
  triggerComparator VARCHAR(2) NOT NULL,
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (sensorEventID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (outputID) REFERENCES Outputs(outputID),
  FOREIGN KEY (sensorID) REFERENCES Sensors(sensorID),
  FOREIGN KEY (createdBy) REFERENCES Users(username),
  CONSTRAINT both_filled CHECK (
    (
      startTime IS NULL
      AND stopTime IS NULL
    )
    OR (
      startTime IS NOT NULL
      AND stopTime IS NOT NULL
    )
  ),
  CONSTRAINT is_valid CHECK (JSON_VALID(triggerValues))
);
## Connected
## Should get passed all sensor/output data by default
CREATE TABLE PythonSensorEvents (
  pythonSensorEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  ## Both start/stop time NULL is always
  startTime TIME DEFAULT NULL,
  stopTime TIME DEFAULT NULL,
  sensorID INT NOT NULL,
  triggerValues JSON NOT NULL,
  triggerComparator VARCHAR(2) NOT NULL,
  pythonScript VARCHAR(256),
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (pythonSensorEventID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (sensorID) REFERENCES Sensors(sensorID),
  FOREIGN KEY (createdBy) REFERENCES Users(username),
  CONSTRAINT both_filled CHECK (
    (
      startTime IS NULL
      AND stopTime IS NULL
    )
    OR (
      startTime IS NOT NULL
      AND stopTime IS NOT NULL
    )
  )
);
## Connected
CREATE TABLE EmailSensorEvents (
  emailSensorEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  ## Both start/stop time NULL is always
  startTime TIME DEFAULT NULL,
  stopTime TIME DEFAULT NULL,
  email VARCHAR(256) DEFAULT NULL,
  sensorID INT NOT NULL,
  triggerValues JSON NOT NULL,
  triggerComparator VARCHAR(2) NOT NULL,
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (emailSensorEventID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (sensorID) REFERENCES Sensors(sensorID),
  FOREIGN KEY (createdBy) REFERENCES Users(username),
  CONSTRAINT both_filled CHECK (
    (
      startTime IS NULL
      AND stopTime IS NULL
    )
    OR (
      startTime IS NOT NULL
      AND stopTime IS NOT NULL
    )
  ),
  CHECK (JSON_VALID(triggerValues))
);
## Connected
## Gradient and start/stop events
CREATE TABLE BoundedEvents (
  boundedEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  startTime TIME NOT NULL,
  stopTime TIME NOT NULL,
  outputID INT NOT NULL,
  outputValueStart INT NOT NULL,
  ## outputValueStart = 0 is off,
  ## outputValueStart > 0 is on,
  ## outputValueStart < 0 is random 
  outputValueEnd INT NOT NULL,
  ## outputValueEnd = 0 is off,
  ## outputValueEnd > 0 is on,
  ## outputValueEnd < 0 is random 
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (boundedEventID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (outputID) REFERENCES Outputs(outputID),
  FOREIGN KEY (createdBy) REFERENCES Users(username)
);
## Connected
CREATE TABLE SunTrackerEvents (
  sunTrackerEventID INT NOT NULL AUTO_INCREMENT,
  dayID INT NOT NULL,
  ## Both start/stop time NULL is always
  startTime TIME DEFAULT NULL,
  stopTime TIME DEFAULT NULL,
  coordinates POINT NOT NULL,
  outputID INT NOT NULL,
  createdDate TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP ON UPDATE LOCALTIMESTAMP,
  createdBy VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (sunTrackerEventID),
  FOREIGN KEY (dayID) REFERENCES Days(dayID),
  FOREIGN KEY (outputID) REFERENCES Outputs(outputID),
  FOREIGN KEY (createdBy) REFERENCES Users(username),
  CONSTRAINT both_filled CHECK (
    (
      startTime IS NULL
      AND stopTime IS NULL
    )
    OR (
      startTime IS NOT NULL
      AND stopTime IS NOT NULL
    )
  )
);
#########################
####### DAYS #####
## Get all days
DELIMITER $$ 
CREATE PROCEDURE `getDays` () READS SQL DATA
SELECT *
FROM Days;
$$
DELIMITER ;
## Add new day
DELIMITER $$
CREATE PROCEDURE `addDay` (
  IN `p_weekday` TINYINT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO Days (weekday, createdBy)
VALUES (p_weekday, p_createdBy);
$$
DELIMITER ;
## Delete day
DELIMITER $$ 
CREATE PROCEDURE `removeDay` (IN `p_dayID` INT) MODIFIES SQL DATA
DELETE FROM Days
WHERE Days.dayID = p_dayID;
$$
DELIMITER ;
## Update day
DELIMITER $$ 
CREATE PROCEDURE `updateDay` (IN `p_dayID` INT, IN `p_weekday` TINYINT) MODIFIES SQL DATA
UPDATE Days
SET weekday = p_weekday,
  createdDate = LOCALTIMESTAMP
WHERE Days.dayID = p_dayID;
$$
DELIMITER ;
####### RANDOM EVENTS #####
## Get all random events
DELIMITER $$ 
CREATE PROCEDURE `getRandomEvents` () READS SQL DATA
SELECT *
FROM RandomEvents;
$$
DELIMITER ;
## Get Random events by dayID
DELIMITER $$ 
CREATE PROCEDURE `getRandomEventsByDayID` (IN `p_dayID` INT) 
READS SQL DATA
SELECT *
FROM RandomEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new random event
DELIMITER $$
CREATE PROCEDURE `addRandomEvent` (
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValue` INT,
  IN `p_occurrences` INT,
  IN `p_duration` INT,
  IN `p_minTimeout` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO RandomEvents (
    dayID,
    startTime,
    stopTime,
    outputID,
    outputValue,
    occurrences,
    duration,
    minTimeout,
    createdBy
  )
VALUES (
    p_dayID,
    p_startTime,
    p_stopTime,
    p_outputID,
    p_outputValue,
    p_occurrences,
    p_duration,
    p_minTimeout,
    p_createdBy
  );
$$
DELIMITER ;
## Delete random event
DELIMITER $$
CREATE PROCEDURE `removeRandomEvent` (IN `p_randomEventID` INT) MODIFIES SQL DATA
DELETE FROM RandomEvents
WHERE RandomEvents.randomEventID = p_randomEventID;
$$
DELIMITER ;
## UPDATE random event
DELIMITER $$
CREATE PROCEDURE `updateRandomEvent` (
  IN `p_randomEventID` INT,
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValue` INT,
  IN `p_occurrences` INT,
  IN `p_duration` INT,
  IN `p_minTimeout` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE RandomEvents
SET 
    dayID = p_dayID,
    startTime = p_startTime,
    stopTime = p_stopTime,
    outputID = p_outputID,
    outputValue = p_outputValue,
    occurrences = p_occurrences,
    duration = p_duration,
    minTimeout = p_minTimeout,
    createdBy = p_createdBy
WHERE randomEventID = p_randomEventID;
$$
DELIMITER ;
####### RANDOM PYTHON EVENTS #####
## Get all random python events
DELIMITER $$
CREATE PROCEDURE `getRandomPythonEvents` () READS SQL DATA
SELECT *
FROM RandomPythonEvents;
$$
DELIMITER ;
## Get RandomPython events by dayID
DELIMITER $$ 
CREATE PROCEDURE `getRandomPythonEventsByDayID` (IN `p_dayID` INT) 
READS SQL DATA
SELECT *
FROM RandomPythonEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new random python event
DELIMITER $$
CREATE PROCEDURE `addRandomPythonEvent` (
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_pythonScript` VARCHAR(256),
  IN `p_occurrences` INT,
  IN `p_duration` INT,
  IN `p_minTimeout` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO RandomPythonEvents (
    dayID,
    startTime,
    stopTime,
    pythonScript,
    occurrences,
    duration,
    minTimeout,
    createdBy
  )
VALUES (
    p_dayID,
    p_startTime,
    p_stopTime,
    p_pythonScript,
    p_occurrences,
    p_duration,
    p_minTimeout,
    p_createdBy
  );
$$
DELIMITER ;
## Delete random python event
DELIMITER $$
CREATE PROCEDURE `removeRandomPythonEvent` (IN `p_randomPythonEventID` INT) MODIFIES SQL DATA
DELETE FROM RandomPythonEvents
WHERE RandomPythonEvents.randomPythonEventID = p_randomPythonEventID;
$$
DELIMITER ;
## Update random python event
DELIMITER $$
CREATE PROCEDURE `updateRandomPythonEvent` (
  IN `p_randomPythonEventID` INT,
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_pythonScript` VARCHAR(256),
  IN `p_occurrences` INT,
  IN `p_duration` INT,
  IN `p_minTimeout` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE RandomPythonEvents
SET
    dayID = p_dayID,
    startTime = p_startTime,
    stopTime = p_stopTime,
    pythonScript = p_pythonScript,
    occurrences = p_occurrences,
    duration = p_duration,
    minTimeout = p_minTimeout,
    createdBy = p_createdBy = p_createdBy
WHERE randomEventID = p_randomEventID;
$$
DELIMITER ;
####### RECURRING EVENTS #####
## Get all recurring events
DELIMITER $$
CREATE PROCEDURE `getRecurringEvents` ()
READS SQL DATA
SELECT *
FROM RecurringEvents;
$$
DELIMITER ;
## Get Recurring events by dayID
DELIMITER $$ 
CREATE PROCEDURE `getRecurringEventsByDayID` (IN `p_dayID` INT)
READS SQL DATA
SELECT *
FROM RecurringEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new recurring event
DELIMITER $$
CREATE PROCEDURE `addRecurringEvent` (
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValue` INT,
  IN `p_timeoutTime` TIMESTAMP,
  IN `p_repeatTime` TIMESTAMP,
  IN `p_minTimeout` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO RecurringEvents (
    dayID,
    startTime,
    stopTime,
    outputID,
    outputValue,
    occurrences,
    duration,
    minTimeout,
    createdBy
  )
VALUES (
    p_dayID,
    p_startTime,
    p_stopTime,
    p_outputID,
    p_outputValue,
    p_occurrences,
    p_duration,
    p_minTimeout,
    p_createdBy
  );
$$
DELIMITER ;
## Delete recurring event
DELIMITER $$
CREATE PROCEDURE `removeRecurringEvent` (IN `p_randomEventID` INT) MODIFIES SQL DATA
DELETE FROM RecurringEvents
WHERE RandomEvents.randomEventID = p_randomEventID;
$$
DELIMITER ;
## Update recurring event
DELIMITER $$
CREATE PROCEDURE `updateRecurringEvent` (
  IN `p_randomEventID` INT,
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValue` INT,
  IN `p_occurrences` INT,
  IN `p_duration` INT,
  IN `p_minTimeout` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE RecurringEvents
SET
    dayID = p_dayID,
    startTime = p_startTime,
    stopTime = p_stopTime,
    outputID = p_outputID,
    outputValue = p_outputValue,
    occurrences = p_occurrences,
    duration = p_duration,
    minTimeout = p_minTimeout,
    createdBy = p_createdBy
WHERE randomEventID = p_randomEventID;
$$
DELIMITER ;
####### RECURRING PYTHON EVENTS #####
## Get all recurring python events
DELIMITER $$
CREATE PROCEDURE `getRecurringPythonEvents` () READS SQL DATA
SELECT *
FROM RecurringPythonEvents;
$$
DELIMITER ;
## Get RecurringPython events by dayID
DELIMITER $$ 
CREATE PROCEDURE `getRecurringPythonEventsByDayID` (IN `p_dayID` INT) MODIFIES SQL DATA
SELECT *
FROM RecurringPythonEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new recurring python event
DELIMITER $$
CREATE PROCEDURE `addRecurringPythonEvent` (
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValue` INT,
  IN `p_timeoutTime` TIMESTAMP,
  IN `p_repeatTime` TIMESTAMP,
  IN `p_minTimeout` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO RecurringPythonEvents (
    dayID,
    startTime,
    stopTime,
    pythonScript,
    occurrences,
    duration,
    minTimeout,
    createdBy
  )
VALUES (
    p_dayID,
    p_startTime,
    p_stopTime,
    p_pythonScript,
    p_occurrences,
    p_duration,
    p_minTimeout,
    p_createdBy
  );
$$
DELIMITER ;
## Delete recurring python event
DELIMITER $$
CREATE PROCEDURE `removeRecurringPythonEvent` (IN `p_recurringPythonEventID` INT) MODIFIES SQL DATA
DELETE FROM RecurringPythonEvents
WHERE RandomEvents.randomEventID = p_randomEventID;
$$
DELIMITER ;
## Update recurring python event
DELIMITER $$
CREATE PROCEDURE `updateRecurringPythonEvent` (
  IN `p_recurringPythonEventID` INT,
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_pythonScript` VARCHAR(256),
  IN `p_occurrences` INT,
  IN `p_duration` INT,
  IN `p_minTimeout` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE RecurringPythonEvents
SET
    dayID = p_dayID,
    startTime = p_startTime,
    stopTime = p_stopTime,
    pythonScript = p_pythonScript,
    occurrences = p_occurrences,
    duration = p_duration,
    minTimeout = p_minTimeout,
    createdBy = p_createdBy
WHERE randomEventID = p_randomEventID;
$$
DELIMITER ;
####### TIME EVENTS #####
## Get all time events
DELIMITER $$
CREATE PROCEDURE `getTimeEvents` () READS SQL DATA
SELECT *
FROM TimeEvents;
$$
DELIMITER ;
## Get time events by dayID
DELIMITER $$
CREATE PROCEDURE `getTimeEventsByDayID` (IN `p_dayID` INT) MODIFIES SQL DATA
SELECT *
FROM TimeEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new time event
DELIMITER $$
CREATE PROCEDURE `addTimeEvent` (
  IN `p_dayID` INT,
  IN `p_triggerTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValue` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO TimeEvents (
    dayID,
    triggerTime,
    outputID,
    outputValue,
    createdBy
  )
VALUES (
    p_dayID,
    p_triggerTime,
    p_outputID,
    p_outputValue,
    p_createdBy
  );
$$
DELIMITER ;
## Delete time event
DELIMITER $$
CREATE PROCEDURE `removeTimeEvent` (IN `p_timeEventID` INT) MODIFIES SQL DATA
DELETE FROM TimeEvents
WHERE TimeEvents.timeEventID = p_timeEventID;
$$
DELIMITER ;
## Update time event
DELIMITER $$
CREATE PROCEDURE `updateTimeEvent` (
  IN `p_timeEventID` INT,
  IN `p_dayID` INT,
  IN `p_triggerTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValue` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE TimeEvents
SET
    dayID = p_dayID,
    triggerTime = p_triggerTime,
    outputID = p_outputID,
    outputValue = p_outputValue,
    createdBy = p_createdBy
WHERE timeEventID = p_timeEventID;
$$
DELIMITER ;
####### PYTHON TIME EVENTS #####
## Get all time events
DELIMITER $$
CREATE PROCEDURE `getPythonTimeEvents` () READS SQL DATA
SELECT *
FROM PythonTimeEvents;
$$
DELIMITER ;
## Get PythonTime events by dayID
DELIMITER $$ 
CREATE PROCEDURE `getPythonTimeEventsByDayID` (IN `p_dayID` INT) MODIFIES SQL DATA
SELECT *
FROM PythonTimeEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new python time event
DELIMITER $$
CREATE PROCEDURE `addPythonTimeEvent` (
  IN `p_dayID` INT,
  IN `p_triggerTime` TIME,
  IN `p_pythonScript` VARCHAR(256),
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO PythonTimeEvents (dayID, triggerTime, pythonScript, createdBy)
VALUES (
    p_dayID,
    p_triggerTime,
    p_pythonScript,
    p_createdBy
  );
$$
DELIMITER ;
## Delete python time event
DELIMITER $$
CREATE PROCEDURE `removePythonTimeEvent` (IN `p_timeEventID` INT) MODIFIES SQL DATA
DELETE FROM PythonTimeEvents
WHERE PythonTimeEvents.pythonTimeEventID = p_pythonTimeEventID;
$$
DELIMITER ;
## Update python time event
DELIMITER $$
CREATE PROCEDURE `updatePythonTimeEvent` (
  IN `p_pythonTimeEventID` INT,
  IN `p_dayID` INT,
  IN `p_triggerTime` TIME,
  IN `p_pythonScript` VARCHAR(256),
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE PythonTimeEvents
SET dayID = p_dayID, triggerTime = p_triggerTime, pythonScript = p_pythonScript, createdBy = p_createdBy
WHERE pythonTimeEventID = p_pythonTimeEventID;
$$
DELIMITER ;
####### SENSOR EVENTS #####
## Get all sensor events
DELIMITER $$
CREATE PROCEDURE `getSensorEvents` () READS SQL DATA
SELECT *
FROM SensorEvents;
$$
DELIMITER ;
## Get Sensor events by dayID
DELIMITER $$ 
CREATE PROCEDURE `getSensorEventsByDayID` (IN `p_dayID` INT) MODIFIES SQL DATA
SELECT *
FROM SensorEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new sensor event
DELIMITER $$
CREATE PROCEDURE `addSensorEvent` (
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValue` INT,
  IN `p_sensorID` INT,
  IN `p_triggerValues` JSON,
  IN `p_triggerComparator` VARCHAR(2),
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO SensorEvents (
    dayID,
    startTime,
    stopTime,
    outputID,
    outputValue,
    sensorID,
    triggerValues,
    triggerComparator,
    createdBy
  )
VALUES (
    p_dayID,
    p_startTime,
    p_stopTime,
    p_outputID,
    p_outputValue,
    p_sensorID,
    p_triggerValues,
    p_triggerComparator,
    p_createdBy
  );
$$
DELIMITER ;
## Delete sensor event
DELIMITER $$
CREATE PROCEDURE `removeSensorEvent` (IN `p_sensorEventID` INT) MODIFIES SQL DATA
DELETE FROM SensorEvents
WHERE SensorEvents.sensorEventID = p_sensorEventID;
$$
DELIMITER ;
## Update sensor event
DELIMITER $$
CREATE PROCEDURE `updateSensorEvent` (
  IN `p_sensorEventID` INT,
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValue` INT,
  IN `p_sensorID` INT,
  IN `p_triggerValues` JSON,
  IN `p_triggerComparator` VARCHAR(2),
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE SensorEvents
SET
    dayID = p_dayID,
    startTime = p_startTime,
    stopTime = p_stopTime,
    outputID = p_outputID,
    outputValue = p_outputValue,
    sensorID = p_sensorID,
    triggerValues = p_triggerValues,
    triggerComparator = p_triggerComparator,
    createdBy = p_createdBy
WHERE sensorEventID = p_sensorEventID;
$$
DELIMITER ;
####### PYTHON SENSOR EVENTS #####
## Get all python sensor events
DELIMITER $$
CREATE PROCEDURE `getPythonSensorEvents` () READS SQL DATA
SELECT *
FROM PythonSensorEvents;
$$
DELIMITER ;
## Get PythonSensor events by dayID
DELIMITER $$ 
CREATE PROCEDURE `getPythonSensorEventsByDayID` (IN `p_dayID` INT) MODIFIES SQL DATA
SELECT *
FROM PythonSensorEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new python sensor event
DELIMITER $$
CREATE PROCEDURE `addPythonSensorEvent` (
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_pythonScript` VARCHAR(256),
  IN `p_sensorID` INT,
  IN `p_triggerValues` JSON,
  IN `p_triggerComparator` VARCHAR(2),
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO PythonSensorEvents (
    dayID,
    startTime,
    stopTime,
    pythonScript,
    sensorID,
    triggerValues,
    triggerComparator,
    createdBy
  )
VALUES (
    p_dayID,
    p_startTime,
    p_stopTime,
    p_pythonScript,
    p_sensorID,
    p_triggerValues,
    p_triggerComparator,
    p_createdBy
  );
$$
DELIMITER ;
## Delete python sensor event
DELIMITER $$
CREATE PROCEDURE `removePythonSensorEvent` (IN `p_pythonSensorEventID` INT) MODIFIES SQL DATA
DELETE FROM PythonSensorEvents
WHERE PythonSensorEvents.sensorEventID = p_sensorEventID;
$$
DELIMITER ;
## Update python sensor event
DELIMITER $$
CREATE PROCEDURE `updatePythonSensorEvent` (
  IN `p_pythonSensorEventID` INT,
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_pythonScript` VARCHAR(256),
  IN `p_sensorID` INT,
  IN `p_triggerValues` JSON,
  IN `p_triggerComparator` VARCHAR(2),
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE PythonSensorEvents
SET
    dayID = p_dayID,
    startTime = p_startTime,
    stopTime = p_stopTime,
    pythonScript = p_pythonScript,
    sensorID = p_sensorID,
    triggerValues = p_triggerValues,
    triggerComparator = p_triggerComparator,
    createdBy = p_createdBy
WHERE sensorEventID = p_sensorEventID;
$$
DELIMITER ;
####### EMAIL SENSOR EVENTS #####
## Get all email sensor events
DELIMITER $$
CREATE PROCEDURE `getEmailSensorEvents` () READS SQL DATA
SELECT *
FROM EmailSensorEvents;
$$
DELIMITER ;
## Get EmailSensor events by dayID
DELIMITER $$ 
CREATE PROCEDURE `getEmailSensorEventsByDayID` (IN `p_dayID` INT) MODIFIES SQL DATA
SELECT *
FROM EmailSensorEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new email sensor event
DELIMITER $$
CREATE PROCEDURE `addEmailSensorEvent` (
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_email` VARCHAR(256),
  IN `p_sensorID` INT,
  IN `p_triggerValues` JSON,
  IN `p_triggerComparator` VARCHAR(2),
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO EmailSensorEvents (
    dayID,
    startTime,
    stopTime,
    email,
    sensorID,
    triggerValues,
    triggerComparator,
    createdBy
  )
VALUES (
    p_dayID,
    p_startTime,
    p_stopTime,
    p_email,
    p_sensorID,
    p_triggerValues,
    p_triggerComparator,
    p_createdBy
  );
$$
DELIMITER ;
## Delete email sensor event
DELIMITER $$
CREATE PROCEDURE `removeEmailSensorEvent` (IN `p_emailSensorEventID` INT) MODIFIES SQL DATA
DELETE FROM EmailSensorEvents
WHERE EmailSensorEvents.sensorEventID = p_sensorEventID;
$$
DELIMITER ;
## Update email sensor event
DELIMITER $$
CREATE PROCEDURE `updateEmailSensorEvent` (
  IN `p_emailSensorEventID` INT,
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_email` VARCHAR(256),
  IN `p_sensorID` INT,
  IN `p_triggerValues` JSON,
  IN `p_triggerComparator` VARCHAR(2),
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE EmailSensorEvents
SET
    dayID = p_dayID,
    startTime = p_startTime,
    stopTime = p_stopTime,
    email = p_email,
    sensorID = p_sensorID,
    triggerValues = p_triggerValues,
    triggerComparator = p_triggerComparator,
    createdBy = p_createdBy
WHERE sensorEventID = p_sensorEventID;
$$
DELIMITER ;
####### BOUNDED EVENTS #####
## Get all bounded events
DELIMITER $$
CREATE PROCEDURE `getBoundedEvents` () READS SQL DATA
SELECT *
FROM BoundedEvents;
$$
DELIMITER ;
## Get BoundedEvents events by dayID
DELIMITER $$ 
CREATE PROCEDURE `getBoundedEventsByDayID` (IN `p_dayID` INT) MODIFIES SQL DATA
SELECT *
FROM BoundedEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new bounded event
DELIMITER $$
CREATE PROCEDURE `addBoundedEvent` (
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValueStart` INT,
  IN `p_outputValueEnd` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO BoundedEvents (
    dayID,
    startTime,
    stopTime,
    outputID,
    outputValueStart,
    outputValueEnd,
    createdBy
  )
VALUES (
    p_dayID,
    p_startTime,
    p_stopTime,
    p_outputID,
    p_outputValueStart,
    p_outputValueEnd,
    p_createdBy
  );
$$
DELIMITER ;
## Delete bounded event
DELIMITER $$
CREATE PROCEDURE `removeBoundedEvent` (IN `p_sensorEventID` INT) MODIFIES SQL DATA
DELETE FROM BoundedEvents
WHERE BoundedEvents.boundedEventID = p_boundedEventID;
$$
DELIMITER ;
## Update bounded event
DELIMITER $$
CREATE PROCEDURE `updateBoundedEvent` (
  IN `p_sensorEventID` INT,
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_outputID` INT,
  IN `p_outputValueStart` INT,
  IN `p_outputValueEnd` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE BoundedEvents
SET
    dayID = p_dayID,
    startTime = p_startTime,
    stopTime = p_stopTime,
    outputID = p_outputID,
    outputValueStart = p_outputValueStart,
    outputValueEnd = p_outputValueEnd,
    createdBy = p_createdBy
WHERE boundedEventID = p_boundedEventID;
$$
DELIMITER ;
####### SUNTRACKER EVENTS #####
## Get all suntracker events
DELIMITER $$
CREATE PROCEDURE `getSunTrackerEvents` () READS SQL DATA
SELECT *
FROM SunTrackerEvents;
$$
DELIMITER ;
## Get SunTracker events by dayID
DELIMITER $$ 
CREATE PROCEDURE `getSunTrackerEventsByDayID` (IN `p_dayID` INT) MODIFIES SQL DATA
SELECT *
FROM SunTrackerEvents
WHERE dayID = p_dayID;
$$
DELIMITER ;
## Add new suntracker event
DELIMITER $$
CREATE PROCEDURE `addSunTrackerEvent` (
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_coordinates` POINT,
  IN `p_outputID` INT,
  IN `p_outputValueStart` INT,
  IN `p_outputValueEnd` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
INSERT INTO SunTrackerEvents (
    dayID,
    startTime,
    stopTime,
    coordinates,
    outputID,
    createdBy
  )
VALUES (
    p_dayID,
    p_startTime,
    p_stopTime,
    p_coordinates,
    p_outputID,
    p_createdBy
  );
$$
DELIMITER ;
## Delete suntracker event
DELIMITER $$
CREATE PROCEDURE `removeSunTrackerEvent` (IN `p_sensorEventID` INT) MODIFIES SQL DATA
DELETE FROM SunTrackerEvents
WHERE SunTrackerEvents.sunTrackerEventID = p_sunTrackerEventID;
$$
DELIMITER ;
## Update suntracker event
DELIMITER $$
CREATE PROCEDURE `updateSunTrackerEvent` (
  IN `p_sensorEventID` INT,
  IN `p_dayID` INT,
  IN `p_startTime` TIME,
  IN `p_stopTime` TIME,
  IN `p_coordinates` POINT,
  IN `p_outputID` INT,
  IN `p_outputValueStart` INT,
  IN `p_outputValueEnd` INT,
  IN `p_createdBy` VARCHAR(32)
) MODIFIES SQL DATA
UPDATE SunTrackerEvents
SET
    dayID = p_dayID,
    startTime = p_startTime,
    stopTime = p_stopTime,
    coordinates = p_coordinates,
    outputID = p_outputID,
    createdBy = p_createdBy
WHERE sunTrackerEventID = p_sunTrackerEventID;
$$
DELIMITER ;

#############################################
############# STORED PROCEDURES #############
#############################################

#############OUTPUTS#############


##Insert new Output
DELIMITER $$
CREATE PROCEDURE `addOutput` ( IN `p_name` VARCHAR(64), IN `p_type` VARCHAR(32), IN `p_description` VARCHAR(128), IN `p_outputPWM` BOOLEAN, IN `p_outputPWMPin` INT, IN `p_outputPWMInversion` BOOLEAN, IN `p_order` INT)
MODIFIES SQL DATA
	INSERT INTO Outputs (outputName, outputType, outputDescription, outputPWM, outputPWMPin, outputPWMInversion, outputOrder) VALUES (p_name, p_type, p_description, p_outputPWM, p_outputPWMPin, p_outputPWMInversion, p_order);
$$
DELIMITER ;

##Get Outputs
DELIMITER $$
CREATE PROCEDURE `getOutputs`()
READS SQL DATA
  SELECT * FROM Outputs
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `getOrderedOutputs`()
READS SQL DATA
  SELECT * FROM Outputs ORDER BY outputOrder = 0, outputOrder;
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `getOutputState`()
READS SQL DATA
  SELECT outputID, outputScheduleState, outputScheduleOutputValue, outputManualState, outputManualOutputValue, outputController, outputLastController
  FROM Outputs
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `getOutputStateByID`(IN `p_outputID` INT)
READS SQL DATA
  SELECT outputID, outputScheduleState, outputScheduleOutputValue, outputManualState, outputManualOutputValue, outputController, outputLastController
  FROM Outputs Where outputID = p_outputID
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `updateOutput`(IN `p_outputID` INT, IN `p_name` VARCHAR(64), IN `p_type` VARCHAR(32), IN `p_description` VARCHAR(128), IN `p_outputPWM` BOOLEAN, IN `p_outputPWMPin` INT, IN `p_outputPWMInversion` BOOLEAN, IN `p_order` INT)
MODIFIES SQL DATA
  UPDATE Outputs SET outputName = p_name, outputType = p_type, outputDescription = p_description, outputPWM = p_outputPWM, outputPWMPin = p_outputPWMPin, outputPWMInversion = p_outputPWMInversion, outputOrder = p_order 
  WHERE outputID = p_outputID
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `updateOutputController`(IN `p_outputID` INT, IN `p_outputController` VARCHAR(32))
MODIFIES SQL DATA
  UPDATE Outputs SET outputController = p_outputController 
  WHERE outputID = p_outputID
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `updateOutputLastController`(IN `p_outputID` INT, IN `p_outputLastController` VARCHAR(32))
MODIFIES SQL DATA
  UPDATE Outputs SET outputLastController = p_outputLastController 
  WHERE outputID = p_outputID
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `updateOutputScheduleState`(IN `p_outputID` INT, IN `p_outputScheduleState` BOOLEAN, IN `p_outputScheduleOutputValue` INT)
MODIFIES SQL DATA
  UPDATE Outputs SET outputScheduleState = p_outputScheduleState, outputScheduleOutputValue = p_outputScheduleOutputValue
  WHERE outputID = p_outputID
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `updateOutputManualState`(IN `p_outputID` INT, IN `p_outputManualState` BOOLEAN, IN `p_outputManualOutputValue` INT)
MODIFIES SQL DATA
  UPDATE Outputs SET outputputManualState = p_outputManualState, outputManualOutputValue = p_outputManualOutputValue
  WHERE outputID = p_outputID
  $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `removeOutput`(IN `p_outputID` INT)
MODIFIES SQL DATA
  DELETE FROM Outputs
  WHERE outputID = p_outputID
  $$
DELIMITER ;

#############SENSOR HARDWARE#############

##Insert new sensor
DELIMITER $$
CREATE PROCEDURE `addSensor` (IN `p_model` VARCHAR(64), IN `p_type` VARCHAR(32), IN `p_location` VARCHAR(64), IN `p_units` VARCHAR(16), IN `p_hardwareID` INT, IN `p_sensorProtocol` VARCHAR(32), IN `p_address` VARCHAR(64), IN `p_pin` INT)
MODIFIES SQL DATA
  INSERT INTO Sensors (sensorModel, sensorType, sensorLocation, sensorUnits, sensorHardwareID, sensorProtocol, sensorAddress, sensorPin) VALUES (p_model, p_type, p_location, p_units, p_hardwareID, p_sensorProtocol, p_address, p_pin)
  $$
DELIMITER ;

##Get sensor data for ALL sensors
DELIMITER $$
CREATE PROCEDURE `getSensors`()
READS SQL DATA
  SELECT * FROM Sensors;
$$
DELIMITER ;

##Update sensor 
DELIMITER $$
CREATE PROCEDURE `updateSensor`(IN `p_sensorID` INT, IN `p_model` VARCHAR(64), IN `p_type` VARCHAR(32), IN `p_location` VARCHAR(64), IN `p_units` VARCHAR(16), IN `p_hardwareID` INT, IN `p_protocol` VARCHAR(32), IN `p_address` VARCHAR(64), IN `p_pin` INT)
MODIFIES SQL DATA
  UPDATE Sensors SET sensorModel = p_model, sensorType = p_type, sensorLocation = p_location, sensorUnits = p_units, sensorHardwareID = p_hardwareID, sensorProtocol = p_protocol, sensorAddress = p_address, sensorPin = p_pin WHERE sensorID = p_sensorID
$$
DELIMITER $$

##Update sensor Address
DELIMITER $$
CREATE PROCEDURE `updateSensorAddress` (IN `p_sensorID` INT, IN `p_sensorAddress` VARCHAR(64))
MODIFIES SQL DATA
  UPDATE Sensors SET sensorAddress = p_sensorAddress WHERE sensorID = p_sensorID
$$
DELIMITER $$

##Update sensor Pin
DELIMITER $$
CREATE PROCEDURE `updateSensorPin`(IN `p_sensorID` INT, IN `p_sensorPin` VARCHAR(64))
MODIFIES SQL DATA
  UPDATE Sensors SET sensorPin = p_sensorPin WHERE sensorID = p_sensorID
$$
DELIMITER $$

##Delete Sensor
DELIMITER $$
CREATE PROCEDURE `removeSensor`(IN `p_sensorID` INT)
MODIFIES SQL DATA
  DELETE FROM Sensors
  WHERE sensorID = p_sensorID;
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

#############Users##############

##Add New User
DELIMITER $$
CREATE PROCEDURE `addUser` (IN `p_username` VARCHAR(32), IN `p_hash` VARCHAR(60), in `p_email` VARCHAR(255))
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



COMMIT;