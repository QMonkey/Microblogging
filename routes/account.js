var express = require("express");
var mongoose = require("mongoose");
var crypto = require("crypto");
var uuid = require('node-uuid');

var model = require("./model");

var router = express.Router();

router.get("/current", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findById(accountId).populate("icon blogs").exec(function(err, doc) {
			if(doc) {
				response.send({
					id: doc._id,
					userName: doc.userName,
					nickname: doc.nickname,
					realName: doc.realName,
					email: doc.email,
					birthday: doc.birthday,
					sex: doc.sex,
					phone: doc.phone,
					address: doc.address,
					introduction: doc.introduction,
					icon: doc.icon ? {
						name: doc.icon.name,
						path: doc.icon.path
					} : null,
					followings: doc.followings.length,
					followers: doc.followers.length,
					blogs: doc.blogs.length,
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
	model.Account.findOne({ userName: requestData.userName }).populate("icon blogs").exec(function(err, doc) {
		if(err) {
			response.send({
				error: err.message
			});
		} else if(doc) {
			var sha1 = crypto.createHash("sha1");
			if(doc.password === sha1.update(requestData.password + doc.salt).digest("hex")) {
				request.session.accountId = doc._id;
				response.send({
					id: doc._id,
					userName: doc.userName,
					nickname: doc.nickname,
					realName: doc.realName,
					email: doc.email,
					birthday: doc.birthday,
					sex: doc.sex,
					phone: doc.phone,
					address: doc.address,
					introduction: doc.introduction,
					icon: doc.icon ? {
						name: doc.icon.name,
						path: doc.icon.path
					} : null,
					followings: doc.followings.length,
					followers: doc.followers.length,
					blogs: doc.blogs.length,
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
	var account = new model.Account({
		userName: requestData.userName,
		salt: uuid.v4().replace(/-/g, ""),
		nickname: requestData.nickname,
		realName: requestData.realName,
		email: requestData.email,
		birthday: requestData.birthday,
		sex: requestData.sex,
		phone: requestData.phone,
		address: requestData.address
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
});

router.get("/doSignOut", function(request, response) {
	request.session.destroy();
	response.send({});
});

router.get("/unreadMessages", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		var prompt = {};
		model.Message.count({
			receiver: accountId,
			receiveTime: 0,
			type: "at"
		}, function(err, cnt) {
			if(!err) {
				if(cnt) {
					prompt.ats = cnt;
				}
				model.Message.count({
					receiver: accountId,
					receiveTime: 0,
					type: "whisper"
				}, function(err, cnt) {
					if(!err) {
						if(cnt) {
							prompt.whispers = cnt;
						}
						model.Comment.count({
							receiver: accountId,
							receiveTime: 0
						}, function(err, cnt) {
							if(!err) {
								if(cnt) {
									prompt.comments = cnt;
								}
								response.send(prompt);
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

router.get("/followers", function(request, response) {
	var accountId = request.query.id;
	model.Account.findById(accountId).populate("icon followers").exec(function(err, account) {
		if(account && account.followers.length > 0) {
			model.File.populate(account.followers, "icon", function(err, followers) {
				response.send(followers.map(function(account) {
					return {
						id: account._id,
						userName: account.userName,
						nickname: account.nickname,
						realName: account.realName,
						email: account.email,
						birthday: account.birthday,
						sex: account.sex,
						phone: account.phone,
						address: account.address,
						introduction: account.introduction,
						icon: account.icon ? {
							name: account.icon.name,
							path: account.icon.path
						} : null,
						followings: account.followings.length,
						followers: account.followers.length,
						blogs: account.blogs.length,
						relation: "follower"
					}
				}));
			});
		} else {
			response.send({});
		}
	});
});

router.get("/followings", function(request, response) {
	var accountId = request.query.id;
	model.Account.findById(accountId).populate("icon followings").exec(function(err, account) {
		if(account && account.followings.length > 0) {
			model.File.populate(account.followings, "icon", function(err, followings) {
				response.send(followings.map(function(account) {
					return {
						id: account._id,
						userName: account.userName,
						nickname: account.nickname,
						realName: account.realName,
						email: account.email,
						birthday: account.birthday,
						sex: account.sex,
						phone: account.phone,
						address: account.address,
						introduction: account.introduction,
						icon: account.icon ? {
							name: account.icon.name,
							path: account.icon.path
						} : null,
						followings: account.followings.length,
						followers: account.followers.length,
						blogs: account.blogs.length,
						relation: "following"
					}
				}));
			});
		} else {
			response.send({});
		}
	});
});

router.post("/follow", function(request, response) {
	var accountId = request.session.accountId;
	var followedId = request.body.id;
	if(accountId) {
		if(accountId !== followedId) {
			model.Account.findById(followedId, function(err, doc) {
				if(doc) {
					doc.followers.push(accountId);
					doc.save(function(err) {
						if(!err) {
							model.Account.findById(accountId, function(err, doc) {
								if(doc) {
									doc.followings.push(followedId);
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
						} else {
							response.send({
								error: err.message
							});
						}
					});
				} else {
					response.send({
						error: "Wrong parameter!"
					});
				}
			});
		} else {
			response.send({});
		}
	} else {
		response.send({
			error: "Please sign in first!"
		});
	}
});

router.post("/unfollow", function(request, response) {
	var accountId = request.session.accountId;
	var unfollowedId = request.body.id;
	if(accountId) {
		if(accountId !== unfollowedId) {
			model.Account.findById(unfollowedId, function(err, doc) {
				var index;
				if(doc && (index = doc.followers.indexOf(accountId)) !== -1) {
					doc.followers.splice(index, 1);
					doc.save(function(err) {
						if(!err) {
							model.Account.findById(accountId, function(err, doc) {
								var index;
								if(doc && (index = doc.followings.indexOf(unfollowedId)) !== -1) {
									doc.followings.splice(index, 1);
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
						} else {
							response.send({
								error: err.message
							});
						}
					});
				} else {
					response.send({
						error: "Wrong parameter!"
					});
				}
			});
		} else {
			response.send({});
		}
	} else {
		response.send({
			error: "Please sign in first!"
		});
	}
});

module.exports = router;