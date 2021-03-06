var express = require("express");
var mongoose = require("mongoose");

var model = require("./model");

var router = express.Router();

var app, io;

router.get("/blogComments", function(request, response) {
	var blogId = request.query.id;
	if(blogId) {
		model.Blog.findById(blogId).populate("comments").exec(function(err, blog) {
			if(blog) {
				model.Comment.populate(blog.comments, "publisher receiver", function(err, comments) {
					if(comments.length > 0) {
						model.File.populate(comments, "publisher.icon receiver.icon", function(err, comments) {
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
						});
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

router.get("/myReceivedComments", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		model.Comment.find({
			receiver: accountId
		}).populate("publisher receiver").exec(function(err, comments) {
			if(comments && comments.length > 0) {
				var currentTime = Date.now();
				comments.forEach(function(comment) {
					if(comment.receiveTime === 0) {
						comment.receiveTime = currentTime;
						comment.save(function(err) {
							if(err) {
								console.log(err);
							}
						});
					}
				});
				model.File.populate(comments, "publisher.icon receiver.icon", function(err, comments) {
					comments.sort(function(a, b) {
						return a.publishTime < b.publishTime;
					});
					response.send(comments.map(function(comment) {
						return {
							id: comment.id,
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

router.get("/myIssuedComments", function(request, response) {
	var accountId = request.session.accountId;
	if (accountId) {
		model.Account.findById(accountId).populate("icon comments").exec(function(err, account) {
			if(account) {
				model.Comment.populate(account.comments, "receiver", function(err, comments) {
					model.File.populate(comments, "receiver.icon", function(err, comments) {
						if(comments && comments.length > 0) {
							comments.sort(function(a, b) {
								return a.publishTime < b.publishTime;
							});
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
					
							response.send(comments.map(function(comment) {
								return {
									id: comment.id,
									content: comment.content,
									publisher: publisher,
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
				response.send({
					error: "Please sign in first!"
				});
			}
		});
	}
});

var commentAt = function(publisher, comment) {
	var matches = comment.content.match(/@\w+/g);
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
							if(accountMap[account._id]) {
								accountMap[account._id].forEach(function(info) {
									if(info.online) {
										io.sockets.connected[info.socketId].emit("prompt", {});
									}
								});
							}
							publisher.messages.push(at._id);
							publisher.save(function() {});
							comment.ats.push(at._id);
							comment.save(function() {});
						}
					});
				}
			});
		});
	}
};

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
					publisher: accountId,
					publishTime: Date.now(),
					blog: blogId
				});
				model.Blog.findById(blogId, function(err, blog) {
					var accountMap = app.get("accountMap");
					if(blog) {
						comment.receiver = blog.publisher;
						comment.save(function(err) {
							if(!err) {
								if(accountMap[comment.receiver]) {
									accountMap[comment.receiver].forEach(function(info) {
										if(info.online) {
											io.sockets.connected[info.socketId].emit("prompt", {});
										}
									});
								}
								account.comments.push(comment._id);
								account.save(function(err) {
									if(!err) {
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
																	commentAt(account, comment);
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
													commentAt(account, comment);
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
		model.Account.findById(accountId, function(err, account) {
			if(account) {
				model.Comment.findById(commentId, function(err, comment) {
					if(comment) {
						var great = new model.Message({
							sender: accountId,
							receiver: comment.publisher,
							sendTime: Date.now(),
							type: "great"
						});
						great.save(function(err) {
							if(!err) {
								account.messages.push(great._id);
								account.save(function(err) {
									if(!err) {
										comment.greats.push(great._id);
										comment.save(function(err) {
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