
-- TEST DATA --

-- Available Sensor Types: Temperature, Pressure, Humidity
-- Available Output Types: Light, PWM Light, Exhaust, PWM Exhaust, Intake, PWM intake, Circulation, Heat, Water


CALL addNewOutputType('Standard Output', 0, 0, 1);
CALL addNewOutputType('Standard PWM Output', 1, 0, 1);
CALL addNewOutputType('Inverted PWM Output', 1, 1, 1);

-- Add outputs

CALL addNewOutput(1, 'Standard Output', '', 0);
CALL addNewOutput(2, 'Standard PWM Output', '', 1);
CALL addNewOutput(3, 'Inverted PWM Output', '', 2);

-- Add sensors 
CALL addNewSensor('BME280', 'Temperature', 'Control Box', '°F', 1, 'I2C', NULL);
CALL addNewSensor('BME280', 'Pressure', 'Control Box', 'kPa', 1, 'I2C', NULL);
CALL addNewSensor('BME280', 'Humidity', 'Control Box', '% rH', 1, 'I2C', NULL);
CALL addNewSensor('DS18B20', 'Temperature', 'OutsideF', '°F', 2, 'ONEWIRE', NULL);
CALL addNewSensor('DS18B20', 'Temperature', 'OutsideC', '°C', 3, 'ONEWIRE', NULL);

CALL addNewUser ('test_user', '$2y$10$K1ZvYq8/LVfmx7uj.uGNuuOzh9JBocxyXZamyRMKSW.NGzRMqTbXu', 'notarealemailaddress@example.com');


