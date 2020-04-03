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
