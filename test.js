var five = require("./node_modules/johnny-five")
var board = new five.Board({
  debug: true,
  repl: false,
});

board.on("ready", function() {
  var temp = new five.Thermometer({
    controller: "BME280",
    address:0x76,
  });
  temp.on('data', () => {console.log(temp.celsius)})
  // console.log(multi);

  //   console.log("Thermometer");
  //   console.log("  celsius      : ", multi.thermometer.celsius);
  //   console.log("  fahrenheit   : ", multi.thermometer.fahrenheit);
  //   console.log("  kelvin       : ", multi.thermometer.kelvin);
  //   console.log("--------------------------------------");

  //   console.log("Barometer");
  //   console.log("  pressure     : ", multi.barometer.pressure);
  //   console.log("--------------------------------------");

  //   console.log("Hygrometer");
  //   console.log("  humidity     : ", multi.hygrometer.relativeHumidity);
  //   console.log("--------------------------------------");

  //   console.log("Altimeter");
  //   console.log("  feet         : ", multi.altimeter.feet);
  //   console.log("  meters       : ", multi.altimeter.meters);
  //   console.log("--------------------------------------");
  // multi.on("data", function() {
  //   console.log("Thermometer");
  //   console.log("  celsius      : ", this.thermometer.celsius);
  //   console.log("  fahrenheit   : ", this.thermometer.fahrenheit);
  //   console.log("  kelvin       : ", this.thermometer.kelvin);
  //   console.log("--------------------------------------");
  
  //   console.log("Barometer");
  //   console.log("  pressure     : ", this.barometer.pressure);
  //   console.log("--------------------------------------");
  
  //   console.log("Hygrometer");
  //   console.log("  humidity     : ", this.hygrometer.relativeHumidity);
  //   console.log("--------------------------------------");
  
  //   console.log("Altimeter");
  //   console.log("  feet         : ", this.altimeter.feet);
  //   console.log("  meters       : ", this.altimeter.meters);
  //   console.log("--------------------------------------");
  // });
});
