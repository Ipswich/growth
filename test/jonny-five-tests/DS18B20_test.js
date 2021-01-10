var five = require("johnny-five")

var addresses = []
board = new five.Board({repl: false});

board.on("ready", function() {
  console.log("READY")
  var temp = new five.Thermometer({ 
      controller: "DS18B20",
      pin: "38"
    })
  temp.on("change", () => {console.log(temp.celsius)})
  // let arr = []
  // five.Thermometer.Drivers.get(this, "DS18B20", {pin: '38'})
  //     .on('initialized', function(addr) {
  //       console.log("INITIALIZED")
  //       arr.push(addr)
  //     });

  // setTimeout(() => {
  //   console.log(arr)
  //   temp = new five.Thermometer({controller: "DS18B20", address: arr[0], pin:41})
  //   temp2 = new five.Thermometer({controller: "DS18B20", address: arr[1], pin:41})
  //   temp.on("data", () => {console.log("TEMP: " + temp.address.toString(16))})
  //   temp2.on("data", () => {console.log("TEMP2: " + temp2.address.toString(16))})
  // }, 500)
      
});
