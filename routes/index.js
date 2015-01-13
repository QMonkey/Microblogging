var express = require("express");
var path = require("path");
var router = express.Router();

var app, io;

router.get("/", function(request, response) {
	response.sendFile(path.join(path.dirname(module.parent.filename), "views", "index.html"));
});

module.exports = function(application, socketIO) {
	app = application;
	io = socketIO;
	return router;
};