-- DEFAULT VALUES --

CALL addNewOutputType('Light', 1);
CALL addNewOutputType('Circulation', 1);
CALL addNewOutputType('Exhaust', 1);
CALL addNewOutputType('Intake', 1);
CALL addNewOutputType('Heat', 1);
CALL addNewOutputType('Water', 1);

CALL addNewScheduleType ('Time', 1);
CALL addNewScheduleType ('Sensor', 1);
CALL addNewScheduleType ('Periodic', 1);
CALL addNewScheduleType ('Manual', 1);

CALL addNewEvent ('Output On', 'ON', 1);
CALL addNewEvent ('Output Off', 'OFF', 1);
CALL addNewEvent ('Warn', 'Warn', 1);

CALL addNewSensorType('Temperature', 1);
CALL addNewSensorType('Pressure', 1);
CALL addNewSensorType('Humidity', 1);
CALL addNewSensorType('CarbonDioxide', 0);

CALL addNewUser ('SYSTEM', 'SYSTEM');
