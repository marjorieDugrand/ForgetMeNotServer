var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');

var mongoose = require('mongoose');
var tasks_Model = require('./models/tasks');
var users_Model = require('./models/users');
var contexts_Model = require('./models/contexts');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

// Load the routes
var router = require('./router')(app);

mongoose.connect('mongodb://localhost:27017/forgetMeNot', function(err){
    if (err) {
        console.log(err.message);
    }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({'message': err.message, 'error': err});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({'message': err.message, 'error': err});
});


module.exports = app;
