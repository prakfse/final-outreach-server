// trigger the config
require("./config/config");
require("./models/db");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require('passport');

var indexRouter = require('./routes/index');

var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

app.use((err, req, res, next) => {
    if(err.name === "ValidationError"){
        var valErrors = [];
        Object.keys(err.errors).forEach(key => 
            valErrors.push(err.errors[key].message));
            res.status(422).send(valErrors);
    }
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT, () => console.log('Server started at PORT:' + process.env.PORT));

module.exports = app;
