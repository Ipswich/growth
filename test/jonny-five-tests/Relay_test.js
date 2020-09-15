var five = require("johnny-five")
var board = new five.Board({
  debug: true,
  repl: false,
});

board.on("ready", function() {
  var relay = new five.Relay({pin:24});
  relay.open()
});
