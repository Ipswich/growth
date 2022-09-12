let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let app = express();
let ConfigHelper = require('./models/utility/ConfigHelper')
//Database connection
let dbcalls = require('./models/utility/database_calls')
//Custom Modules for Events/Readings
let SystemInitializer = require('./models/SystemInitializer.js')
const Printouts = require('./models/utility/Printouts');

//API
const indexRouter = require('./api/index');
const addUserRouter = require('./api/addUser');
const outputsRouter = require('./api/Outputs')
const sensorsRouter = require('./api/Sensors')
const loginRouter = require('./api/login');
const serverRouter = require('./api/server');
const imagesRouter = require('./api/images');

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


//Routes for API
app.use('/', indexRouter);
app.use('/api/', indexRouter);

app.use('/api/user', addUserRouter);
app.use('/api/outputs', outputsRouter);
app.use('/api/sensors', sensorsRouter);
app.use('/api/login', loginRouter);
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
new Promise(async (resolve, reject) => {
  try {
    ConfigHelper.reloadConfig()
    ConfigHelper.reloadWebData()
    ConfigHelper.reloadBoardPinout()
    let config = ConfigHelper.constructor.config
    config.board_pinout = ConfigHelper.constructor.board_pinout
    let web_data = ConfigHelper.constructor.web_data
    app.set('warnState', ConfigHelper.constructor.warnState);
    app.set('config', config);
    app.set('web_data', ConfigHelper.constructor.web_data)
    await dbcalls.getPool(config)
    await dbcalls.testConnectivity()
    // Create growth system
    if (process.env.NODE_ENV == "debug-web-only"){
      resolve();
    } else {
      let hardware = await SystemInitializer.initialize(config, web_data);
      // Store state in app
      app.set('hardware', hardware)
      resolve()
    }
  } catch (e) {
    reject(e)
  }
}).then(() => {
  Printouts.simpleLogPrintout('Service is live!')
})
// .catch((e) => {
  // If errors on startup, exit.
//   debugPrintout(e)
//   process.exit(-1)
// })

module.exports = app;
