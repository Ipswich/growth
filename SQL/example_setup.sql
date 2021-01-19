-- Available Sensor Types: Temperature, Pressure, Humidity
-- Available Output Types: Light, PWM Light, Exhaust, PWM Exhaust, Intake, PWM intake, Circulation, Heat, Water

-- Add a user
CALL addNewUser ('admin', '$2b$10$KDSExpDtZd1HXxCZemfxxeZlRCqXD1ZhDPNkIBxjeaYZyaxMUVi9m', NULL);

-- Add outputs
CALL addNewOutput(1, 'QB Growlight 1', '');
CALL addNewOutput(1, 'QB Growlight 2',  '');
CALL addNewOutput(1, '660nm Growlight',  '');
CALL addNewOutput(8, 'Water Valve', '');
CALL addNewOutput(7, 'Heater', '');
CALL addNewOutput(5, 'Exhaust Fan', '');
CALL addNewOutput(3, 'Circulation Fan 1', '');
CALL addNewOutput(3, 'Circulation Fan 2', '');

-- Add sensors 
CALL addNewSensor('BME280', 'Temperature', 'Control Box', '°F', 1, 'I2C');
CALL addNewSensor('BME280', 'Pressure', 'Control Box', 'kPa', 1, 'I2C');
CALL addNewSensor('BME280', 'Humidity', 'Control Box', '% rH', 1, 'I2C');
CALL addNewSensor('DS18B20', 'Temperature', 'Outside', '°F', 2, 'ONEWIRE');