-- DEFAULT VALUES --
CALL addNewOutputType('Light', 1);
CALL addNewOutputType('Circulation', 1);
CALL addNewOutputType('Exhaust', 1);
CALL addNewOutputType('Intake', 1);
CALL addNewOutputType('Heat', 1);

CALL addNewScheduleType ('Time', 1);
CALL addNewScheduleType ('Sensor', 1);
CALL addNewScheduleType ('Periodic', 1);

CALL addNewEvent ('Output On', 'ON', 1);
CALL addNewEvent ('Output Off', 'OFF', 1);

CALL addNewUser ('admin', '$2b$10$KDSExpDtZd1HXxCZemfxxeZlRCqXD1ZhDPNkIBxjeaYZyaxMUVi9m');
CALL addNewUser ('SYSTEM', 'SYSTEM');

CALL addNewSensorType('Temperature', 1);
CALL addNewSensorType('Pressure', 1);
CALL addNewSensorType('Humidity', 1);
CALL addNewSensorType('CarbonDioxide', 0);

-- TEST DATA --
CALL addNewOutput('Light', 'Growlight 1', '');
CALL addNewOutput('Light', 'Growlight 2', '');
CALL addNewOutput('Circulation', 'Circulation Fan', '');
CALL addNewOutput('Exhaust', 'Exhaust Fan', '');
CALL addNewOutput('Heat', 'Heater', '');

CALL addNewSensor('BME280', 'Temperature', 'Control Box', '°F', 1, 'I2C');
CALL addNewSensor('BME280', 'Pressure', 'Control Box', 'kPa', 1, 'I2C');
CALL addNewSensor('BME280', 'Humidity', 'Control Box', '% rH', 1, 'I2C');
CALL addNewSensor('DS18B20', 'Temperature', 'Outside', '°F', 2, 'ONEWIRE');
CALL addNewSensor('DS18B20', 'Temperature', 'Light', '°F', 3, 'ONEWIRE');

-- time output check

CALL addNewSchedule('Time', 1, NULL, NULL, 1, 100, NULL, (now() + INTERVAL 1 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 1, NULL, NULL, 2, 15, NULL, (now() + INTERVAL 1 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 1, NULL, NULL, 3, 100, NULL, (now() + INTERVAL 1 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 1, NULL, NULL, 4, 100, NULL, (now() + INTERVAL 1 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 1, NULL, NULL, 5, 100, NULL, (now() + INTERVAL 1 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);

CALL addNewSchedule('Time', 1, NULL, NULL, 1, 15, NULL, (now() + INTERVAL 2 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 1, NULL, NULL, 2, 100, NULL, (now() + INTERVAL 2 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 2, NULL, NULL, 3, 100, NULL, (now() + INTERVAL 2 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 2, NULL, NULL, 4, 100, NULL, (now() + INTERVAL 2 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 2, NULL, NULL, 5, 100, NULL, (now() + INTERVAL 2 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);

CALL addNewSchedule('Time', 2, NULL, NULL, 1, 100, NULL, (now() + INTERVAL 3 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 2, NULL, NULL, 2, 100, NULL, (now() + INTERVAL 3 MINUTE), NULL, NULL, '1000-01-01', '9999-12-31', 1, 'admin', NULL);