var express = require("express");
var mongoose = require("mongoose");

var model = require("./model");

var router = express.Router();

var app, io;

router.get("/myWhispers", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		model.Message.find({
			receiver: accountId,
			type: "whisper"
		}).populate("sender receiver").sort({ receiveTime: "desc" }).exec(function(err, whispers) {
			model.File.populate(whispers, "sender.icon receiver.icon", function(err, whispers) {
				model.Message.distinct("sender", function(err, accountIds) {
					var lastestWhispers = [];
					if(accountIds && accountIds.length > 0) {
						accountIds.forEach(function(accountId) {
							whispers.some(function(whisper) {
								if(whisper.sender._id.toString() === accountId.toString()) {
									lastestWhispers.push(whisper);
									return true;
								}
								return false;
							});
						});
						response.send(lastestWhispers.map(function(whisper) {
							return {
								content: whisper.content,
								sender: {
									id: whisper.sender._id,
									userName: whisper.sender.userName,
									nickname: whisper.sender.nickname,
									realName: whisper.sender.realName,
									email: whisper.sender.email,
									birthday: whisper.sender.birthday,
									sex: whisper.sender.sex,
									phone: whisper.sender.phone,
									address: whisper.sender.address,
									introduction: whisper.sender.introduction,
									icon: whisper.sender.icon ? {
										name: whisper.sender.icon.name,
										path: whisper.sender.icon.path
									} : null
								},
								receiver: {
									id: whisper.receiver._id,
									userName: whisper.receiver.userName,
									nickname: whisper.receiver.nickname,
									realName: whisper.receiver.realName,
									email: whisper.receiver.email,
									birthday: whisper.receiver.birthday,
									sex: whisper.receiver.sex,
									phone: whisper.receiver.phone,
									address: whisper.receiver.address,
									introduction: whisper.receiver.introduction,
									icon: whisper.receiver.icon ? {
										name: whisper.receiver.icon.name,
										path: whisper.receiver.icon.path
									} : null
								},
								sendTime: whisper.sendTime,
								receiveTime: whisper.receiveTime
							};
						}));
					} else {
						response.send({});
					}
				});
			});
		});
	} else {
		response.send({
			error: "Please sign in first!"
		});
	}
});

router.get("/whispers", function(request, response) {
	var accountId = request.session.accountId;
	var receiver = request.query.receiver;
	var params = {
		sender: accountId,
		type: "whisper"
	};
	if(receiver) {
		params.receiver = receiver;
	}
	if(accountId) {
		model.Message.find(params).populate("sender receiver").exec(function(err, whispers) {
			if(whispers && whispers.length > 0) {
				var currentTime = Date.now();
				whispers.forEach(function(whisper) {
					if(whisper.receiveTime === 0) {
						whisper.receiveTime = currentTime;
						whisper.save(function(err) {
							if(err) {
								console.log(err);
							}
						});
					}
				});
				model.File.populate(whispers, "sender.icon receiver.icon", function(err, whispers) {
					response.send(whispers.map(function(whisper) {
						return {
							content: whisper.content,
							sender: {
								id: whisper.sender._id,
								userName: whisper.sender.userName,
								nickname: whisper.sender.nickname,
								realName: whisper.sender.realName,
								email: whisper.sender.email,
								birthday: whisper.sender.birthday,
								sex: whisper.sender.sex,
								phone: whisper.sender.phone,
								address: whisper.sender.address,
								introduction: whisper.sender.introduction,
								icon: whisper.sender.icon ? {
									name: whisper.sender.icon.name,
									path: whisper.sender.icon.path
								} : null
							},
							receiver: {
								id: whisper.receiver._id,
								userName: whisper.receiver.userName,
								nickname: whisper.receiver.nickname,
								realName: whisper.receiver.realName,
								email: whisper.receiver.email,
								birthday: whisper.receiver.birthday,
								sex: whisper.receiver.sex,
								phone: whisper.receiver.phone,
								address: whisper.receiver.address,
								introduction: whisper.receiver.introduction,
								icon: whisper.receiver.icon ? {
									name: whisper.receiver.icon.name,
									path: whisper.receiver.icon.path
								} : null
							},
							sendTime: whisper.sendTime,
							receiveTime: whisper.receiveTime
						};
					}));
				});
			} else {
				response.send({});
			}
		});
	} else {
		response.send({
			error: "Please sign in first!"
		});
	}
});

router.post("/send", function(request, response) {
	var accountId = request.session.accountId;
	var requestData = request.body;
	if(accountId) {
		model.Account.findById(accountId, function(err, account) {
			var whisper;
			if(account) {
				whisper = new model.Message({
					content: requestData.content,
					sender: accountId,
					receiver: requestData.receiver,
					sendTime: Date.now(),
					type: "whisper"
				});
				whisper.save(function(err) {
					var accountMap = app.get("accountMap");
					if(!err) {
						if(accountMap[requestData.receiver]) {
							accountMap[requestData.receiver].forEach(function(info) {
								if(info.online) {
									io.sockets.connected[info.socketId].emit("prompt", {});
								}
							});
						}
						account.messages.push(whisper._id);
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
	} else {
		response.send({
			error: "Please sign in first!"
		});
	}
});

module.exports = function(application, socketIO) {
	app = application;
	io = socketIO;
	return router;
};