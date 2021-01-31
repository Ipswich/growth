# growth
growth is a Raspberry Pi and Arduino based environment controller with a focus on expandability and data logging. Using Node.js as a web server, Johnny-Five as an Arduino controller, and MariaDB to store data, growth provides a simple, mobile friendly interface that allows users to view current conditions and set daily schedules and triggers based on attached sensors. These schedules and triggers can also be set to occur specifically between a range of dates.

When the server is run, growth reads in outputs and sensors from the database and dynamically attaches them to the Arduino - automatically handling data logging and adding devices to the user interface. As such, expanding functionality is as simple as turning off the server, doing some wiring, adding a row to the database, then restarting the server.

Additionally, while the interface and status of the system is visible without a login, changes to the schedule or triggers require authentication. This allows users to quickly view the status of the system while ensuring the potential to change the system is secured. This also enables the system to track who makes changes to schedules and triggers.

#### Features
* Easily add, remove, or replace sensors and outputs
* Quickly view detailed conditions through raw data and charts (minutely sensor logging)
* Authentication and audit log
* Schedules:
  * Time (at a daily time)
  * Sensor (above or below a value)
  * Periodic (run for a duration, then wait before running again)
  * Manual (trigger instantly, once)
* Events:
  * Output On/Off with PWM intensity control
  * Email warnings
  * Python scripts
