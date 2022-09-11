
START TRANSACTION;
-- DEFAULT VALUES --
USE `growth-test`;

-- Add outputs
CALL addOutput('QB Growlight 1', 'Light', '', 1, 1, 1, 0);
CALL addOutput('QB Growlight 2',  'Light', '', 1, 2, 1, 0);
CALL addOutput('660nm Growlight',  'Light', '', 1, 3, 1, 0);
CALL addOutput('Water Valve', 'Valve', '', 0, NULL, NULL, 0);
CALL addOutput('Heater', 'Heater', '', 0, NULL, NULL, 0);
CALL addOutput('Exhaust Fan', 'Exhaust Fan', '', 1, 4, 1, 0);
CALL addOutput('Circulation Fan 1', 'Circulation Fan', '', 0, NULL, NULL, 0);
CALL addOutput('Circulation Fan 2', 'Circulation Fan', '', 0, NULL, NULL, 0);

-- Add sensors 
CALL addSensor('BME280', 'Temperature', 'Control Box', '°F', 1, 'I2C', '0x76', NULL);
CALL addSensor('BME280', 'Pressure', 'Control Box', 'kPa', 1, 'I2C', '0x76', NULL);
CALL addSensor('BME280', 'Humidity', 'Control Box', '% rH', 1, 'I2C', '0x76', NULL);
CALL addSensor('DS18B20', 'Temperature', 'Outside', '°F', 2, 'ONEWIRE', NULL, NULL);
CALL addSensor('DS18B20', 'Temperature', 'Inside', '°F', 2, 'ONEWIRE', NULL, NULL);

CALL addUser ('SYSTEM', 'SYSTEM', NULL);


COMMIT;