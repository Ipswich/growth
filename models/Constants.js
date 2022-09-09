const Constants = {
  "eventTypes" : [
    "RandomEvents",
    "RandomPythonEvents",
    "RecurringEvents",
    "RecurringPythonEvents",
    "TimeEvents",
    "PythonTimeEvents",
    "SensorEvents",
    "PythonSensorEvents",
    "EmailSensorEvents",
    "BoundedEvents",
    "SunTrackerEvents"
  ],
  "weekdays": {
    "None": "0x0000000",
    "Monday": "0x0000001",
    "Tuesday": "0x0000010",
    "Wednesday": "0x0000100",
    "Thursday": "0x0001000",
    "Friday": "0x0010000",
    "Saturday": "0x0100000",
    "Sunday": "0x1000000"
  },
  "controllerStates":{
    "MANUAL": "MANUAL",
    "SCHEDULE": "SCHEDULE"
  },
  "outputStates":{
    "ON": "1",
    "OFF": "0"
  },
  "sensorProtocols":{
    "ANALOG": "ANALOG",
    "I2C" : "I2C",
    "ONEWIRE" : "ONEWIRE"
  },
  "configuration_file_locations" : {
    "CONFIG_LOCATION" : "/config/config.json",
    "DEFAULT_CONFIG_LOCATION" : "/config/default_config.json",
    "BOARD_MAPPINGS_LOCATION" : "/config/board_mappings.json",
    "WEB_DATA_LOCATION" : "/config/web-data-config.json",
    "DEFAULT_WEB_DATA_LOCATION" : "/config/web-data-config-default.json"
  }
}
module.exports = Constants;