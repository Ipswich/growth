var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var fs = require('fs');

//Custom Modules for Events/Readings
var outputState = require('./custom_node_modules/state_modules/OutputState.js');
var sensorState = require('./custom_node_modules/state_modules/SensorState.js');
var systemInitializer = require('./custom_node_modules/SystemInitializer.js')

//Routes
var indexRouter = require('./routes/index');
var addTimeEventRouter = require('./routes/addTimeEvent');
var addSensorEventRouter = require('./routes/addSensorEvent');
var addPeriodicEventRouter = require('./routes/addPeriodicEvent');
var getScheduleDataRouter = require('./routes/getScheduleData');
var updateScheduleRouter = require('./routes/updateSchedule');

//API
var getEnvironmentRouter = require('./api/getEnvironment')

//App setup - load config
try {
  var config = require('./config/config.json');
} catch (e) {
  console.log("ERROR: Could not locate config.json, using default_config.json instead.");
  var config = require('./config/default_config.json');
  fs.copyFile('./config/default_config.json', './config/config.json', (err) => {
    if (err) {
      console.log("ERROR: Could not copy default_config.json to config.json.");
    }
  });
}

var web_data = require('./config/web-data-config');
app.set('web_data', web_data);
app.set('config', config);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev')); QUIET YE PRINTOUTS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Static routes for public resources
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/@fortawesome/fontawesome-free/css')));
app.use('/webfonts', express.static(path.join(__dirname, '/node_modules/@fortawesome/fontawesome-free/webfonts')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/tempusdominus-bootstrap-4/build/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/tempusdominus-bootstrap-4/build/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/moment/min')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/@popperjs/core/dist/umd')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/chart.js/dist')));

//Routes for web pages
app.use('/', indexRouter);
app.use('/addTimeEvent', addTimeEventRouter);
app.use('/addSensorEvent', addSensorEventRouter);
app.use('/addPeriodicEvent', addPeriodicEventRouter);
app.use('/getScheduleData', getScheduleDataRouter);
app.use('/updateSchedule', updateScheduleRouter);

//Routes for API
app.use('/api/getEnvironment', getEnvironmentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var state = {};
new Promise(async (resolve) => {
  //load output state
  state.outputState = await new outputState();
  resolve(state);
}).then(async (state) => {
  //load sensor state
  state.sensorState = await new sensorState();
  return state;
}).then(async (state) => {
  //Initialize the system based on those states
  await systemInitializer.initialize(state, app);
});

module.exports = app;
