-- DEFAULT VALUES --
USE growth;

CALL addNewOutputType('PWM Light', 1, 1, 1);
CALL addNewOutputType('Light', 0, 0, 1);
CALL addNewOutputType('Circulation', 0, 0, 1);
CALL addNewOutputType('Exhaust', 0, 0, 1);
CALL addNewOutputType('PWM Exhaust', 1, 1, 1);
CALL addNewOutputType('Intake', 0, 0, 1);
CALL addNewOutputType('Heat', 0, 0, 1);
CALL addNewOutputType('Water', 0, 0, 1);

CALL addNewSensorType('Temperature', 1);
CALL addNewSensorType('Pressure', 1);
CALL addNewSensorType('Humidity', 1);
CALL addNewSensorType('CarbonDioxide', 0);

CALL addNewUser ('SYSTEM', 'SYSTEM', NULL);
