var express = require("express");
var mongoose = require("mongoose");
var crypto = require("crypto");

var model = require("./model");

var router = express.Router();
var ObjectId = mongoose.Types.ObjectId;

var app, io;

router.post("/updateInfo", function(request, response) {
	var requestData = request.body;
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findById(accountId, function(err, doc) {
			if(doc) {
				doc.nickname = requestData.nickname;
				doc.realName = requestData.realName;
				doc.email = requestData.email;
				doc.birthday = requestData.birthday;
				doc.sex = requestData.sex;
				doc.phone = requestData.phone;
				doc.address = requestData.address;
				doc.introduction = requestData.introduction;
				doc.save(function(err) {
					if(!err) {
						response.send({});
					} else {
						response.send({
							error: err.message
						});
					}
				});
			} else {
				response.send({
					error: "Please sign in first!"
				});
			}
		});
	}
});

router.post("/updateIcon", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findById(accountId, function(err, account) {
			if(account) {
				var icon = request.files.icon;
				var path = icon.name.substring(0, icon.name.indexOf("_"));

				var file = new model.File({
					name: icon.originalname,
					path: path,
					mimeType: icon.mimetype
				});
				file.save(function(err) {
					if(!err) {
						account.icon = file._id;
						account.save(function(err) {
							if(!err) {
								response.send({});
							} else {
								response.send({
									error: err.message
								});
							}
						});
					} else {
						response.send({
							error: err
						});
					}
				});
			} else {
				response.send({
					error: "Please sign in first!"
				});
			}
		});
	} else {
		response.send({
			error: "Please sign in first!"
		});
	}
});

router.post("/changePassword", function(request, response) {
	var requestData = request.body;
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findById(accountId, function(err, doc) {
			if(doc) {
				if(doc.password === crypto.createHash("sha1").update(
					requestData.originalPassword + doc.salt).digest("hex")) {
					var sha1 = crypto.createHash("sha1");
					doc.password = sha1.update(requestData.newPassword + doc.salt).digest("hex");
					doc.save(function(err) {
						if(!err) {
							request.session.destroy();
							response.send({});
						} else {
							response.send({
								error: err.message
							});
						}
					});
				} else {
					response.send({
						error: "The original password is incorrect."
					});
				}
			} else {
				response.send({
					error: "Please sign in first!"
				});
			}
		});
	}
});

module.exports = function(application, socketIO) {
	app = application;
	io = socketIO;
	return router;
};