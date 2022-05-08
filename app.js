let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let app = express();
//Database connection
let config_helper = require('./custom_node_modules/utility_modules/config_helper')
let dbcalls = require('./custom_node_modules/utility_modules/database_calls')
//Custom Modules for Events/Readings
let OutputState = require('./custom_node_modules/state_modules/OutputState.js');
let SensorState = require('./custom_node_modules/state_modules/SensorState.js');
let systemInitializer = require('./custom_node_modules/initialization_modules/systemInitializer.js')
const { debugPrintout } = require('./custom_node_modules/utility_modules/printouts');

//Routes
const indexRouter = require('./routes/index');
const settingsRouter = require('./routes/settings');
const addTimeEventRouter = require('./routes/addTimeEvent');
const addSensorEventRouter = require('./routes/addSensorEvent');
const addPeriodicEventRouter = require('./routes/addPeriodicEvent');
const addManualEventRouter = require('./routes/addManualEvent');
const getScheduleDataRouter = require('./routes/getScheduleData');
const updateScheduleRouter = require('./routes/updateSchedule');
const addUserRouter = require('./routes/addUser');

//API
const getEnvironmentRouter = require('./api/getEnvironment')
const outputTypeRouter = require('./api/OutputType')
const outputRouter = require('./api/Output')
const sensorRouter = require('./api/Sensor')
const loginRouter = require('./api/login');
const stateRouter = require('./api/state');
const serverRouter = require('./api/server');
const imagesRouter = require('./api/images')



//App setup - load config
app.set('config', config_helper.getConfig());
app.set('web_data', config_helper.getWebData());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev')); 
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
app.use('/settings', settingsRouter);
app.use('/addTimeEvent', addTimeEventRouter);
app.use('/addSensorEvent', addSensorEventRouter);
app.use('/addPeriodicEvent', addPeriodicEventRouter);
app.use('/addManualEvent', addManualEventRouter);
app.use('/getScheduleData', getScheduleDataRouter);
app.use('/updateSchedule', updateScheduleRouter);
app.use('/addUser', addUserRouter);

//Routes for API
app.use('/api/getEnvironment', getEnvironmentRouter);
app.use('/api/outputType', outputTypeRouter);
app.use('/api/output', outputRouter);
app.use('/api/sensor', sensorRouter);
app.use('/api/login', loginRouter);
app.use('/api/state', stateRouter);
app.use('/api/server', serverRouter);
app.use('/api/images', imagesRouter);

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

let state = {};
new Promise(async (resolve, reject) => {
  try {
    await dbcalls.getPool()
    await dbcalls.testConnectivity()
    // Load output and sensor states, exit on error
    state.outputState = await new OutputState();
    state.sensorState = await new SensorState();
    // Initialize the system based on those states
    state.warnState = app.get('warnState')
    await systemInitializer.initialize(state);
    // Store state in app
    app.set('state', state)
    resolve(state)
  } catch (e) {
    reject(e)
  }
}).catch((e) => {
  // If errors on startup, exit.
  debugPrintout(e)
  process.exit(-1)
})

module.exports = app;
