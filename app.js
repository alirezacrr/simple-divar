var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var flash = require('connect-flash');
// var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var favicon = require('serve-favicon');

var busboy = require('connect-busboy'); //middleware for form/file upload

var bodyParser = require("body-parser");
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var db = mongoose.connection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const config = require('./config/dev.json');


var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');





mongoose.connect(config.db, {useNewUrlParser: true});

db.on('error', function () {
    console.log("oh oh");
});
db.once('connected', function () {
    console.log('mongo connect :D');
});
app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: "keyboard cat",
    cookie: {path: '/', httpOnly: true, maxAge: 2629746000},
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({mongooseConnection: db})
}));
app.use(passport.initialize());
app.use(passport.session());

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
    res.status(400);
    res.render('404.ejs', {title: '404: File Not Found'});
});
// Passport init
// app.use(favicon(path.join(__dirname, 'public','images','favicon.ico')));
// var _favicon = favicon(path.join(__dirname, 'public' ,'images', 'favicon.ico'));
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});
// Connect Flash
app.use(flash());


// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
});





// Set Port
app.PORT = config.port;

app.listen(app.PORT, function(){
    console.log('Server started on  http://localhost:'+ app.PORT);
});

module.exports = app;
