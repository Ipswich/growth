-- DEFAULT VALUES --
CALL addNewOutputType('Light', 1);
CALL addNewOutputType('Circulation', 1);
CALL addNewOutputType('Exhaust', 1);
CALL addNewOutputType('Intake', 1);
CALL addNewOutputType('Heat', 1);

CALL addNewScheduleType ('Time', 1);
CALL addNewScheduleType ('Sensor', 1);

CALL addNewEvent ('Output On', 'ON', 1);
CALL addNewEvent ('Output Off', 'OFF', 1);

CALL addUser ('admin', '$2b$10$KDSExpDtZd1HXxCZemfxxeZlRCqXD1ZhDPNkIBxjeaYZyaxMUVi9m');

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

CALL addNewSensor('BME280', 'Temperature', 'Control Box', '°C', 1, 'I2C');
CALL addNewSensor('BME280', 'Pressure', 'Control Box', 'kPa', 1, 'I2C');
CALL addNewSensor('BME280', 'Humidity', 'Control Box', '% rH', 1, 'I2C');
CALL addNewSensor('DS18B20', 'Temperature', 'Outside', '°C', 2, 'ONEWIRE');
CALL addNewSensor('DS18B20', 'Temperature', 'Outside', '°C', 3, 'ONEWIRE');

CALL addSensorReading(1, 75.389);
CALL addSensorReading(2, 600);
CALL addSensorReading(3, 54.7);
CALL addSensorReading(4, 75.7);

CALL addNewSchedule('Time', 1, NULL, NULL, 1, 100, NULL, '11:30:00', '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 1, NULL, NULL, 1, 50, NULL, '12:30:00', '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 1, NULL, NULL, 1, 75, NULL, '13:00:00', '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 1, NULL, NULL, 1, 25, NULL, '13:15:00', '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 2, NULL, NULL, 1, 0, NULL, '13:30:00', '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Sensor', 1, 1, 65, 5, NULL, '>', NULL, NULL, NULL, 1, 'admin', NULL);
CALL addNewSchedule('Sensor', 1, 3, 50, 1, 72, '>', NULL, NULL, NULL, 1, 'admin', NULL);
CALL addNewSchedule('Sensor', 1, 3, 55, 1, 72, '>', NULL, NULL, NULL, 1, 'admin', NULL);
CALL addNewSchedule('Sensor', 1, 2, 46, 1, 72, '<', NULL, NULL, NULL, 1, 'admin', NULL);
CALL addNewSchedule('Sensor', 1, 2, 30, 1, 72, '<', NULL, NULL, NULL, 1, 'admin', NULL);
