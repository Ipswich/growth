# growth
growth is a Raspberry Pi and Arduino based plant grow room controller with a focus on expandability and data logging. Using Node.js as a web server, Johnny-Five as an Arduino controller, and MariaDB to store data, growth provides a simple, mobile friendly interface that allows users to view current conditions and set daily schedules and triggers based on attached sensors. These schedules and triggers can also be set to occur specifically between a range of dates.

When the server is run, growth reads in outputs and sensors from the database and dynamically attaches them to the Arduino - automatically handling data logging and adding devices to the user interface. As such, expanding functionality is as simple as inserting a new row into the database and restarting the server.

Additionally, while the interface and status of the system is visible without a login, changes to the schedule or triggers require authentication. This allows users to quickly view the status of the system while ensuring the potential to change the system is secured. This also enables the system to track who makes changes to schedules and triggers.

## Initial Setup
Setting up growth is intended to be relatively straightforward. Simply add sensors to the database, and restart the service.

### Software Setup
1. Setup and install MariaDB (recommended to install phpMyAdmin as well.)
2. Clone latest version from github to your system. `git clone https://github.com/Ipswich/growth.git`
3. Install dependencies. `cd growth && npm install`
4. Run SQL schema on the MariaDB to create database structure. `SQL/schema_V2.sql`
5. Run SQL data on the MariaDB to load default output types, schedule types, events, sensor types, and user. `SQL/default_data.sql`
6. Create (or update) config.json to reflect your database connection info. If it doesn't exist, config.json will be copied from default_config.json upon running the app for the first time. Important lines to edit are:
      * `"host": "localhost"`
      * `"user": "null"`
      * `"password": "null"`
7. Add a user by running stored procedure `addUser(username, hash)` on database
    * hash is computed using bcrypt with 10 salt rounds. ([bcrypt-generator.com](bcrypt-generator.com))

### Output and Sensor Setup
#### Outputs
To add a new output, use the existing stored procedures in the database: 
1. `addNewOutputType(outputType, enabled)`
2. `addNewOutput(outputType, outputName, outputDescription)`
* Outputs are mapped in the order that they are stored in the database. The first output pin is 22, with each subsequent output taking up the next pin. The last usable pin is 37.
* Variable strength outputs will have their PWM pins mapped according to the order that they are stored in in the database. The first PWM pin is 2, with each subsequent variable strength output taking the next pin. The last usable pin is 13.


#### Sensors
To add a new sensor, use the existing stored procedures in the database: 
1. `addNewSensorType(sensorType, enabled)`
2. `addNewSensor(model, sensorType, sensorLocation, sensorUnits, hardwareID, protocol)`
* Sensors are mapped in the order that they are stored in the database. The first sensor pin is 38, with each subsequent sensor taking the next pin. The last usable pin is 53.
* `sensorType` must match one of the added sensor types.
* `hardwareID` references multiple sensors on one chip.
* protocol references communication protocol (i.e. I2C, ONEWIRE, ANALOG). Leave blank if no specific protocol.



## Prototype/Test Bed Information
### Computational Hardware:
* Raspberry Pi 4, 2GB
* Arduino Mega

### Tested Sensors:
* Bosch BME280
* Maxim DS18B20

### Outputs:
* 8-Channel Relay
* PC817X
