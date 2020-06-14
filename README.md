# growth
growth is a Raspberry Pi and Arduino based plant grow room controller with a focus on expandability and data logging. Using Node.js as a web server, Johnny-Five as an Arduino controller, and MariaDB to store data, growth provides a simple, mobile friendly interface that allows users to view current conditions and set daily schedules and triggers based on attached sensors. These schedules and triggers can also be set to occur specifically between a range of dates.

When the server is run, growth reads in outputs and sensors from the database and dynamically attaches them to the Arduino - automatically handling data logging and adding devices to the user interface. As such, expanding functionality is as simple as inserting a new row into the database and restarting the server.

Additionally, while the interface and status of the system is visible without a login, changes to the schedule or triggers require authentication. This allows users to quickly view the status of the system while ensuring the potential to change the system is secured. This also enables the system to track who makes changes to schedules and triggers.


### Computational Hardware:
* Raspberry Pi 4, 2GB
* Arduino Mega

### Sensors:
* Bosch BME280
* Maxim DS18B20

### Outputs:
* 8-Channel Relay
* PC817X
