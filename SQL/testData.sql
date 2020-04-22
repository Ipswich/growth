CALL addNewOutputType('Light', 1);
CALL addNewOutputType('Circulation', 1);
CALL addNewOutputType('Exhaust', 1);
CALL addNewOutputType('Intake', 1);
CALL addNewOutputType('Heat', 1);

CALL addNewOutput('Light', 'Growlight 1', '');
CALL addNewOutput('Light', 'Growlight 2', '');
CALL addNewOutput('Circulation', 'Circulation Fan', '');
CALL addNewOutput('Exhaust', 'Exhaust Fan', '');
CALL addNewOutput('Heat', 'Heater', '');

CALL addNewSensorType('Temperature', 1);
CALL addNewSensorType('Pressure', 1);
CALL addNewSensorType('Humidity', 1);
CALL addNewSensorType('CarbonDioxide', 0);

CALL addNewSensor('BME280', 'Temperature', 'Control Box', '°C');
CALL addNewSensor('BME280', 'Pressure', 'Control Box', 'hPa');
CALL addNewSensor('BME280', 'Humidity', 'Control Box', '% rH');

CALL addSensorReading(1, 75.389);
CALL addSensorReading(2, 600);
CALL addSensorReading(3, 54.7);

CALL addNewScheduleType ('Time', 1);
CALL addNewScheduleType ('Sensor', 1);

##Light 1
CALL addNewEvent ('Output On', 'ON', 1);
CALL addNewEvent ('Output Off', 'OFF', 1);

CALL addUser ('admin', '$2b$10$KDSExpDtZd1HXxCZemfxxeZlRCqXD1ZhDPNkIBxjeaYZyaxMUVi9m');

CALL addNewSchedule('Time', 1, NULL, NULL, 1, 100, NULL, '11:30:00', '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 1, NULL, NULL, 1, 50, NULL, '12:30:00', '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Time', 2, NULL, NULL, 1, 0, NULL, '13:30:00', '1000-01-01', '9999-12-31', 1, 'admin', NULL);
CALL addNewSchedule('Sensor', 1, 1, 65, 5, NULL, '>', NULL, NULL, NULL, 1, 'admin', NULL);
CALL addNewSchedule('Sensor', 1, 3, 50, 1, 72, '>', NULL, NULL, NULL, 1, 'admin', NULL);
