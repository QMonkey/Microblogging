var express = require("express");
var mongoose = require("mongoose");

var model = require("./model");

var router = express.Router();
var ObjectId = mongoose.Types.ObjectId;

router.get("/getBloggerInfo", function(request, response) {
	var accountId = request.session.accountId;
	var bloggerId = request.query.id;
	if(bloggerId) {
		model.Account.findOne({ _id: new ObjectId(bloggerId) }).populate("info").exec(function(err, doc) {
			if(doc) {
				var marks = 0;
				var relation;
				if(bloggerId === accountId) {
					relation = null;
				} else {
					if(accountId in doc.followings) {
						marks +=1;
					}
					if(accountId in doc.followers) {
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
					info: {
						nickname: doc.info.nickname,
						realName: doc.info.realName,
						email: doc.info.email,
						birthday: doc.info.birthday,
						sex: doc.info.sex,
						phone: doc.info.phone,
						address: doc.info.address,
						introduction: doc.info.introduction
					},
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

router.post("/publish", function(request, response) {
	var accountId = request.session.accountId;
	if(accountId) {
		model.Account.findOne({ _id: new ObjectId(accountId) }, function(err, doc) {
			if(doc) {
				var blog = new model.Blog({
					content: request.body.content
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

module.exports = router;