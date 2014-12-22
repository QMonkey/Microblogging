var express = require("express");
var mongoose = require("mongoose");
var crypto = require("crypto");

var model = require("./model");

var router = express.Router();
var ObjectId = mongoose.Types.ObjectId;

router.post("/updateInfo", function(request, response) {
	var requestData = request.body;
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findOne({ _id: new ObjectId(accountId) }).populate("info").exec(function(err, doc) {
			if(doc) {
				doc.info.nickname = requestData.nickname;
				doc.info.realName = requestData.realName;
				doc.info.email = requestData.email;
				doc.info.birthday = requestData.birthday;
				doc.info.sex = requestData.sex;
				doc.info.phone = requestData.phone;
				doc.info.address = requestData.address;
				doc.info.introduction = requestData.introduction;
				doc.info.save(function(err) {
					if(!err) {
						response.send({});
					} else {
						response.send({
							error: err.message
						})
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

router.post("/changePassword", function(request, response) {
	var requestData = request.body;
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findOne({ _id: new ObjectId(accountId) }, function(err, doc) {
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

module.exports = router;