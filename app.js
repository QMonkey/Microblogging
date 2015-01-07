var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var mongoose = require("mongoose");

var routes = require('./routes/index');
var account = require("./routes/account");
var setting = require("./routes/setting");
var blog = require("./routes/blog");
var comment = require("./routes/comment")

var app = express();

mongoose.connect("mongodb://localhost/Microblogging");

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'session secret key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 3600000
    }
}));

app.use('/', routes);
app.use("/account", account);
app.use("/setting", setting);
app.use("/blog", blog);
app.use("/comment", comment);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// will print stacktrace
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err
    });
});

module.exports = app;
