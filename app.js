var express = require('express');
var path = require('path');
var fs = require("fs");
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var mongoose = require("mongoose");
var multer = require("multer");
var mkdirp = require("mkdirp");
var uuid = require("node-uuid");
var socketIO = require("socket.io");
var debug = require('debug')('Microblogging');

var index = require('./routes/index');
var account = require("./routes/account");
var setting = require("./routes/setting");
var blog = require("./routes/blog");
var comment = require("./routes/comment");
var at = require("./routes/at");
var sio = require("./routes/sio");

var app = express();

app.set("accountMap", {});
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});

var io = socketIO(server);

mongoose.connect("mongodb://localhost/Microblogging");

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
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
app.use(multer({
    dest: path.join("public", "uploads"),
    rename: function (fieldname, filename) {
        return uuid.v4().replace(/-/g, "") + "_" + filename;
    },
    onFileUploadComplete: function(file) {
        var newPath = path.join.apply(this, file.name.substring(0, file.name.indexOf("_")).match(/.{1,4}/g));
        newPath = path.join("public", "uploads", newPath, file.originalname);
        var newPathDirname = path.dirname(newPath);

        mkdirp(newPathDirname, 0755, function(err) {
            if(!err) {
                var source = fs.createReadStream(file.path);
                var dest = fs.createWriteStream(newPath);

                source.pipe(dest);
                source.on('end', function() {
                    fs.unlink(file.path, function() {
                        if(err) {
                            console.log(err);
                        }
                    });
                });
                source.on('error', function(err) {
                    console.log(err);
                });
            } else {
                console.log(err);
            }
        });
    }
}));

app.use('/', index(app, io));
app.use("/account", account(app, io));
app.use("/setting", setting(app, io));
app.use("/blog", blog(app, io));
app.use("/comment", comment(app, io));
app.use("/at", at(app, io));
sio(app, io);

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