var express = require("express");
var mongoose = require("mongoose");

var model = require("./model");

var router = express.Router();

router.get("/blogComments", function(request, response) {
	var blogId = request.query.id;
	if(blogId) {
		model.Blog.findById(blogId).populate("comments").exec(function(err, blog) {
			if(blog) {
				model.Comment.populate(blog.comments, "publisher", function(err, comments) {
					if(comments.length > 0) {
						comments.sort(function(a, b) {
							return a.publishTime < b.publishTime;
						});
						response.send(comments.map(function(comment) {
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
									introduction: comment.publisher.introduction
								},
								publishTime: comment.publishTime,
								receiveTime: comment.receiveTime,
								comments: comment.comments.length,
								ats: comment.ats.length,
								greats: comment.greats.length
							};
						}));
					} else {
						response.send({});
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
			error: "Wrong parameter!"
		});
	}
});

router.post("/publish", function(request, response) {
	var accountId = request.session.accountId;
	var blogId = request.body.blogId;
	var commentId = request.body.commentId;
	var content = request.body.content;
	if(accountId) {
		model.Account.findById(accountId, function(err, account) {
			if(account) {
				var comment = new model.Comment({
					content: content,
					publisher: accountId
				});
				comment.save(function(err) {
					if(!err) {
						account.comments.push(comment._id);
						account.save(function(err) {
							if(!err) {
								model.Blog.findById(blogId, function(err, blog) {
									if(blog) {
										blog.comments.push(comment._id);
										blog.save(function(err) {
											if(!err) {
												if(commentId) {
													model.Comment.findById(commentId, function(err, doc) {
														if(doc) {
															doc.comments.push(comment._id);
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
																error: "Wrong parameter!"
															});
														}
													});
												} else {
													response.send({});
												}
											} else {
												response.send({
													error: err.message
												});
											}
										});
									} else {
										response.send({
											error: "Wrong parameter"
										})
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
	} else {
		response.send({
			error: "Please sign in first!"
		});
	}
});

router.post("/great", function(request, response) {
	var accountId = request.session.accountId;
	var commentId = request.body.id;
	if(accountId) {
	} else {
		response.send({
			error: "Please sign in first!"
		});
	}
});

module.exports = router;