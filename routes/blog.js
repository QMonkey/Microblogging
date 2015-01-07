var express = require("express");
var mongoose = require("mongoose");

var model = require("./model");

var router = express.Router();

router.get("/bloggerInfo", function(request, response) {
	var accountId = request.session.accountId;
	var bloggerId = request.query.id;
	if(bloggerId) {
		model.Account.findById(bloggerId, function(err, doc) {
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
					followings: doc.followings.length,
					followers: doc.followers.length,
					blogs: doc.blogs.length,
					nickname: doc.nickname,
					realName: doc.realName,
					email: doc.email,
					birthday: doc.birthday,
					sex: doc.sex,
					phone: doc.phone,
					address: doc.address,
					introduction: doc.introduction,
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
	model.Account.find({ nickname: new RegExp(key) }, function(err, docs) {
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
					followings: account.followings.length,
					followers: account.followers.length,
					blogs: account.blogs.length,
					nickname: account.nickname,
					realName: account.realName,
					email: account.email,
					birthday: account.birthday,
					sex: account.sex,
					phone: account.phone,
					address: account.address,
					introduction: account.introduction,
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
	}).populate("publisher").sort({ publishTime: "desc" }).exec(function(err, docs) {
		if(docs && docs.length > 0) {
			response.send(docs.map(function(blog) {
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
						introduction: blog.publisher.introduction
					},
					publishTime: blog.publishTime,
					forward: blog.forward,
					comments: blog.comments.length,
					greats: blog.greats.length
				}
			}));
		} else {
			response.send({});
		}
	});
});

router.get("/blogs", function(request, response) {
	var accountId = request.session.accountId;
	var bloggerId = request.query.id;
	if(bloggerId) {
		model.Account.findById(bloggerId).populate("blogs").exec(function(err, doc) {
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
					introduction: doc.introduction
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
						greats: blog.greats.length
					}
				}));
			} else {
				response.send({});
			}
		});
	} else {
		response.send({});
	}
});

router.post("/publish", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findById(accountId, function(err, doc) {
			if(doc) {
				var blog = new model.Blog({
					content: request.body.content,
					publisher: accountId,
					publishTime: Date.now()
				});
				blog.save(function(err) {
					if(!err) {
						doc.blogs.push(blog._id);
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

module.exports = router;