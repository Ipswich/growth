
CALL addNewUser ('admin', '$2b$10$KDSExpDtZd1HXxCZemfxxeZlRCqXD1ZhDPNkIBxjeaYZyaxMUVi9m', 'bsteele146@gmail.com');

CALL addNewOutput('Light', 'QB Growlight 1', 1, 1, '');
CALL addNewOutput('Light', 'QB Growlight 2', 1, 1,  '');
CALL addNewOutput('Light', '660nm Growlight', 1, 1,  '');
CALL addNewOutput('Water', 'Water Valve', 0, 0, '');
CALL addNewOutput('Heat', 'Heater', 0, 0, '');
CALL addNewOutput('Exhaust', 'Exhaust Fan', 0, 0, '');
CALL addNewOutput('Circulation', 'Circulation Fan 1', 0, 0, '');
CALL addNewOutput('Circulation', 'Circulation Fan 2', 0, 0, '');

CALL addNewSensor('BME280', 'Temperature', 'Control Box', '°F', 1, 'I2C');
CALL addNewSensor('BME280', 'Pressure', 'Control Box', 'kPa', 1, 'I2C');
CALL addNewSensor('BME280', 'Humidity', 'Control Box', '% rH', 1, 'I2C');
CALL addNewSensor('DS18B20', 'Temperature', 'Outside', '°F', 2, 'ONEWIRE');
