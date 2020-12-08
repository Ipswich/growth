var five = require("johnny-five")
var board = new five.Board({
  debug: true,
  repl: false,
});

board.on("ready", function() {
  var relay = new five.Relay({pin:2});
  setInterval(function() {
    relay.toggle()
    console.log("toggle")
  }, 2000)
});
