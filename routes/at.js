var express = require("express");
var mongoose = require("mongoose");

var model = require("./model");

var router = express.Router();

router.get("/blogAts", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		model.Message.find({
			receiver: accountId,
			type: "at"
		}, function(err, ats) {
			if(ats && ats.length > 0) {
				model.Blog.find({}).populate("publisher ats").exec(function(err, blogs) {
					blogs.forEach(function(blog) {
						blog.ats.forEach(function(at) {
							if(at.receiveTime === 0) {
								at.receiveTime = Date.now();
								at.save(function(err) {
									if(err) {
										console.log(err);
									}
								});
							}
						});
					});
					model.File.populate(blogs, "publisher.icon", function(err, blogs) {
						var atIds = ats.map(function(at) {
							return at._id.toString();
						});
						if(blogs && blogs.length > 0) {
							response.send(blogs.filter(function(blog) {
								return blog.ats.some(function(atId) {
									return atIds.indexOf(atId.toString()) !== -1;
								});
							}).sort(function(a, b) {
								return a.publishTime < b.publishTime;
							}).map(function(blog) {
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
						} else {
							response.send({});
						}
					});
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

router.get("/commentAts", function(request, response) {
		var accountId = request.session.accountId;
	if(accountId) {
		model.Message.find({
			receiver: accountId,
			type: "at"
		}, function(err, ats) {
			if(ats && ats.length > 0) {
				model.Comment.find({}).populate("publisher receiver ats").exec(function(err, comments) {
					comments.forEach(function(comment) {
						comment.ats.forEach(function(at) {
							if(at.receiveTime === 0) {
								at.receiveTime = Date.now();
								at.save(function(err) {
									if(err) {
										console.log(err);
									}
								});
							}
						});
					});
					model.File.populate(comments, "publisher.icon receiver.icon", function(err, comments) {
						var atIds = ats.map(function(at) {
							return at._id.toString();
						});
						if(comments && comments.length > 0) {
							response.send(comments.filter(function(comment) {
								return comment.ats.some(function(atId) {
									return atIds.indexOf(atId.toString()) !== -1;
								});
							}).sort(function(a, b) {
								return a.publishTime < b.publishTime;
							}).map(function(comment) {
								return {
									id: comment._id,
									content: comment.content,
									publisher: {
										id: comment.publisher._id,
										userName: comment.publisher.userName,
										nickname: comment.publisher.nickname,
										realName: comment.publisher.realName,
										email: comment.publisher.email,
										birthday: comment.publisher.birthday,
										sex: comment.publisher.sex,
										phone: comment.publisher.phone,
										address: comment.publisher.address,
										introduction: comment.publisher.introduction,
										icon: comment.publisher.icon ? {
											name: comment.publisher.icon.name,
											path: comment.publisher.icon.path
										} : null
									},
									receiver: {
										id: comment.receiver._id,
										userName: comment.receiver.userName,
										nickname: comment.receiver.nickname,
										realName: comment.receiver.realName,
										email: comment.receiver.email,
										birthday: comment.receiver.birthday,
										sex: comment.receiver.sex,
										phone: comment.receiver.phone,
										address: comment.receiver.address,
										introduction: comment.receiver.introduction,
										icon: comment.receiver.icon ? {
											name: comment.receiver.icon.name,
											path: comment.receiver.icon.path
										} : null
									},
									publishTime: comment.publishTime,
									receiveTime: comment.receiveTime,
									blog: comment.blog,
									comments: comment.comments.length,
									ats: comment.ats.length,
									greats: comment.greats.length
								};
							}));
						} else {
							response.send({});
						}
					});
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

module.exports = router;