
START TRANSACTION;
-- DEFAULT VALUES --
USE `growth-test`;

-- Add outputs
CALL addOutput('QB Growlight 1', 'Light', '', 1, NULL, 1, 1, 0);
CALL addOutput('QB Growlight 2',  'Light', '', 1, NULL, 2, 1, 0);
CALL addOutput('660nm Growlight',  'Light', '', 1, NULL, 3, 1, 0);
CALL addOutput('Water Valve', 'Valve', '', 0, NULL, NULL, NULL, 0);
CALL addOutput('Heater', 'Heater', '', 0, NULL, NULL, NULL, 0);
CALL addOutput('Exhaust Fan', 'Exhaust Fan', '', 1, NULL, 4, 1, 0);
CALL addOutput('Circulation Fan 1', 'Circulation Fan', '', 0, NULL, NULL, NULL, 0);
CALL addOutput('Circulation Fan 2', 'Circulation Fan', '', 0, NULL, NULL, NULL, 0);

-- Add sensors 
CALL addSensor('BME280', 'Temperature', 'Control Box', '°F', 1, 'I2C', '0x76', NULL);
CALL addSensor('BME280', 'Pressure', 'Control Box', 'kPa', 1, 'I2C', '0x76', NULL);
CALL addSensor('BME280', 'Humidity', 'Control Box', '% rH', 1, 'I2C', '0x76', NULL);
CALL addSensor('DS18B20', 'Temperature', 'Outside', '°F', 2, 'ONEWIRE', NULL, NULL);
CALL addSensor('DS18B20', 'Temperature', 'Inside', '°F', 2, 'ONEWIRE', NULL, NULL);

-- Default accounts
CALL addUser ('SYSTEM', 'SYSTEM', NULL);
CALL addUser ('admin', '$2b$10$KDSExpDtZd1HXxCZemfxxeZlRCqXD1ZhDPNkIBxjeaYZyaxMUVi9m', NULL);

-- Single day, because we need one and multiple aren't supported yet.
CALL addDay (127, 'SYSTEM');

COMMIT;