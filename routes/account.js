var express = require("express");
var mongoose = require("mongoose");
var crypto = require("crypto");
var uuid = require('node-uuid');

var model = require("./model");

var router = express.Router();
var ObjectId = mongoose.Types.ObjectId;

mongoose.connect("mongodb://localhost/Microblogging");

router.get("/current", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findOne({
			_id: new ObjectId(accountId)
		}).populate("info").populate("messages").exec(function(err, doc) {
			if(doc) {
				var messageCounter = 0;
				doc.messages.forEach(function(message) {
					if(message.type === 0) {
						++messageCounter;
					}
				});
				response.send({
					id: doc._id,
					userName: doc.userName,
					followings: doc.followings.length,
					followers: doc.followers.length,
					messages: messageCounter,
					info: {
						nickname: doc.info.nickname,
						realName: doc.info.realName,
						email: doc.info.email,
						birthday: doc.info.birthday,
						sex: doc.info.sex,
						phone: doc.info.phone,
						address: doc.info.address
					},
				});
			} else {
				response.send({});
			}
		});
	} else {
		response.send({});
	}
});

router.post("/doSignIn", function(request, response) {
	var requestData = request.body;
	model.Account.findOne({ 
		userName: requestData.userName 
	}).populate("info").populate("messages").exec(function(err, doc) {
		if(err) {
			response.send({
				error: err.message
			});
		} else if(doc) {
			var sha1 = crypto.createHash("sha1");
			if(doc.password === sha1.update(requestData.password + doc.salt).digest("hex")) {
				request.session.accountId = doc._id;
				var messageCounter = 0;
				doc.messages.forEach(function(message) {
					if(message.type === 0) {
						++messageCounter;
					}
				});
				response.send({
					id: doc._id,
					userName: doc.userName,
					followings: doc.followings.length,
					followers: doc.followers.length,
					messages: messageCounter,
					info: {
						nickname: doc.info.nickname,
						realName: doc.info.realName,
						email: doc.info.email,
						birthday: doc.info.birthday,
						sex: doc.info.sex,
						phone: doc.info.phone,
						address: doc.info.address
					},
				});
			} else {
				response.send({
					error: "Password is incorrect."
				});	
			}
		} else {
			response.send({
				error: "User name is incorrect."
			});
		}
	});
});

router.post("/doSignUp", function(request, response) {
	var requestData = request.body;
	var accountInfo = new model.AccountInfo({
		nickname: requestData.nickname,
		realName: requestData.realName,
		email: requestData.email,
		birthday: requestData.birthday,
		sex: requestData.sex,
		phone: requestData.phone,
		address: requestData.address
	});
	accountInfo.save(function(err) {
		if(err) {
			response.send({
				error: err.message
			});
		} else {
			var account = new model.Account({
				userName: requestData.userName,
				salt: uuid.v4().replace(/-/g, ""),
				info: accountInfo._id
			});
			var sha1 = crypto.createHash("sha1");
			account.password = sha1.update(requestData.password + account.salt).digest("hex");
			account.save(function(err) {
				if(!err) {
					response.send({});
				} else {
					response.send({
						error: err.message
					});
				}
			});
		}
	});
});

router.get("/doSignOut", function(request, response) {
	request.session.destroy();
	response.send({});
});

module.exports = router;