var express = require("express");
var mongoose = require("mongoose");

var model = require("./model");

var router = express.Router();

var app, io;

router.get("/home", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findById(accountId).populate("icon blogs followings").exec(function(err, account) {
			if(account) {
				model.Account.populate(account.followings, "icon blogs", function(err, followings) {
					var homeBlogs = [];
					[ account ].concat(followings).forEach(function(account) {
						var publisher = {
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
							} : null
						};
						homeBlogs = homeBlogs.concat(account.blogs.map(function(blog) {
							return {
								id: blog._id,
								content: blog.content,
								publisher: publisher,
								publishTime: blog.publishTime,
								forward: blog.forward,
								comments: blog.comments.length,
								ats: blog.ats.length,
								greats: blog.greats.length
							};
						}));
					});
					response.send(homeBlogs.sort(function(a, b) {
						return a.publishTime < b.publishTime;
					}));
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

router.get("/bloggerInfo", function(request, response) {
	var accountId = request.session.accountId;
	var bloggerId = request.query.id;
	if(bloggerId) {
		model.Account.findById(bloggerId).populate("icon").exec(function(err, doc) {
			if(doc) {
				var marks = 0;
				var relation;
				if(bloggerId === accountId) {
					relation = null;
				} else {
					if(doc.followings.indexOf(accountId) !== -1) {
						marks += 1;
					}
					if(doc.followers.indexOf(accountId) !== -1) {
						marks += 2;
					}
					switch(marks) {
						case 0:
							relation = "no";
							break;

						case 1:
							relation = "follower";
							break;

						case 2:
							relation = "following";
							break;

						case 3:
							relation = "friend";
							break;

						default:
							break;
					}
				}
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
					relation: relation
				});
			} else {
				response.send({});
			}
		});
	} else {
		response.send({});
	}
});

router.get("/searchBloggers", function(request, response) {
	var accountId = request.session.accountId;
	var key = request.query.key;
	model.Account.find({ nickname: new RegExp(key) }).populate("icon").exec(function(err, docs) {
		if(docs && docs.length > 0) {
			response.send(docs.map(function(account) {
				var marks = 0;
				var relation;
				if(account._id.toString() === accountId) {
					relation = null;
				} else {
					if(account.followings.indexOf(accountId) !== -1) {
						marks += 1;
					}
					if(account.followers.indexOf(accountId) !== -1) {
						marks += 2;
					}
					switch(marks) {
						case 0:
							relation = "no";
							break;

						case 1:
							relation = "follower";
							break;
					
						case 2:
							relation = "following";
							break;

						case 3:
							relation = "friend";
							break;

						default:
							break;
					}
				}
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
					relation: relation
				}
			}));
		} else {
			response.send({});
		}
	});
});

router.get("/search", function(request, response) {
	var accountId = request.session.accountId;
	var key = request.query.key;
	model.Blog.find({
		content: new RegExp(key)
	}).populate("publisher").sort({ publishTime: "desc" }).exec(function(err, blogs) {
		if(blogs && blogs.length > 0) {
			model.File.populate(blogs, "publisher.icon", function(err, blogs) {
				response.send(blogs.map(function(blog) {
					return {
						id: blog._id,
						content: blog.content,
						publisher: {
							id: blog.publisher._id,
							userName: blog.publisher.userName,
							nickname: blog.publisher.nickname,
							realName: blog.publisher.realName,
							email: blog.publisher.email,
							birthday: blog.publisher.birthday,
							sex: blog.publisher.sex,
							phone: blog.publisher.phone,
							address: blog.publisher.address,
							introduction: blog.publisher.introduction,
							icon: blog.publisher.icon ? {
								name: blog.publisher.icon.name,
								path: blog.publisher.icon.path
							} : null
						},
						publishTime: blog.publishTime,
						forward: blog.forward,
						comments: blog.comments.length,
						ats: blog.ats.length,
						greats: blog.greats.length
					};
				}));
			});
		} else {
			response.send({});
		}
	});
});

router.get("/blogs", function(request, response) {
	var accountId = request.session.accountId;
	var bloggerId = request.query.id;
	if(bloggerId) {
		model.Account.findById(bloggerId).populate("icon blogs").exec(function(err, doc) {
			if(doc) {
				var publisher = {
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
					} : null
				};
				doc.blogs.sort(function(a, b) {
					return a.publishTime < b.publishTime;
				});
				response.send(doc.blogs.map(function(blog) {
					return {
						id: blog._id,
						content: blog.content,
						publisher: accountId != bloggerId ? publisher : null,
						publishTime: blog.publishTime,
						forward: blog.forward,
						comments: blog.comments.length,
						ats: blog.ats.length,
						greats: blog.greats.length
					};
				}));
			} else {
				response.send({});
			}
		});
	} else {
		response.send({});
	}
});

var blogAt = function(publisher, blog) {
	var matches = blog.content.match(/@\w+/g);
	if(matches) {
		matches.filter(function(nickname, index, ary) {
			return ary.indexOf(nickname) === index;
		}).forEach(function(nickname) {
			model.Account.findOne({ nickname: nickname.slice(1) }, function(err, account) {
				if(account) {
					var at = new model.Message({
						sender: publisher._id,
						receiver: account._id,
						sendTime: Date.now(),
						type: "at"
					});
					at.save(function(err) {
						var accountMap = app.get("accountMap");
						if(!err) {
							accountMap[account._id].forEach(function(info) {
								if(info.online) {
									io.sockets.connected[info.socketId].emit("prompt", {});
								}
							});
							publisher.messages.push(at._id);
							publisher.save(function(err) {
								if(err) {
									console.log(err);
								}
							});
							blog.ats.push(at._id);
							blog.save(function(err) {
								if(err) {
									console.log(err);
								}
							});
						}
					});
				}
			});
		});
	}
};

router.post("/publish", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findById(accountId, function(err, account) {
			if(account) {
				var blog = new model.Blog({
					content: request.body.content,
					publisher: accountId,
					publishTime: Date.now()
				});
				blog.save(function(err) {
					if(!err) {
						account.blogs.push(blog._id);
						account.save(function(err) {
							if(!err) {
								response.send({});
								blogAt(account, blog);
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

router.post("/great", function(request, response) {
	var accountId = request.session.accountId;
	var blogId = request.body.id;
	if(accountId) {
		model.Account.findById(accountId, function(err, doc) {
			if(doc) {
				var accountDoc = doc;
				model.Blog.findById(blogId, function(err, doc) {
					if(doc) {
						var great = new model.Message({
							sender: accountId,
							sendTime: Date.now(),
							type: "great"
						});
						great.save(function(err) {
							if(!err) {
								var responsed = false;
								accountDoc.messages.push(great._id);
								accountDoc.save(function(err) {
									if(!responsed) {
										responsed = true;
										if(!err) {
											response.send({});
										} else {
											response.send({
												error: err.message
											});
										}
									}
								});
								doc.greats.push(great._id);
								doc.save(function(err) {
									if(!responsed) {
										responsed = true;
										if(!err) {
											response.send({});
										} else {
											response.send({
												error: err.message
											});
										}
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