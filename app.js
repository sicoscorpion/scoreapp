var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('connect-flash');
var Stopwatch = require('./models/stopwatch');
var pkg = require('./package.json');

var routes = require('./routes/index');
var manager = require('./routes/manager');
var display = require('./routes/display');
var upload = require('./routes/upload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "testsecret", cookie: { maxAge: 60000 }}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({
  dest: "./public/uploads/",
  rename: function (fieldname, filename) {
    return filename.replace(/\W+/g, '-').toLowerCase()
  }
}));
app.use(flash());

app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});
process.maxTickDepth = 1000000;

app.use('/', routes);
app.use('/manager', manager);
app.use('/upload', upload);
app.use('/display', display);


// catch 404 and forward to error handler

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
