var app = (function() {
	var app = {};
	var id;

	var updateSidebar = function(signedIn, unsignedIn) {
		var args = arguments;
		$.get("/account/current", function(responseData) {
			if(responseData.id) {
				id = responseData.id;
				if(responseData.icon) {
					$("#sidebarIcon").attr("src", toUploadPath(responseData.icon.path) + responseData.icon.name);
				} else {
					$("#sidebarIcon").attr("src", "/uploads/default.ico");
				}
				$("#sidebarNickname").text(responseData.nickname);
				$("#sidebarFollowingCount").text(responseData.followings);
				$("#sidebarFollowerCount").text(responseData.followers);
				$("#sidebarBlogCount").text(responseData.blogs);
				if(signedIn instanceof Function) {
					signedIn.apply(this, [responseData].concat(Array.prototype.slice.call(args, 2)));
				}
				updateMessenger();
			} else {
				if(unsignedIn instanceof Function) {
					unsignedIn.apply(this, [responseData].concat(Array.prototype.slice.call(arguments, 2)));
				}
			}
		});
	};

	var updateMessenger = function() {
		$.get("/account/unreadMessages", function(responseData) {
			if(!responseData.error) {
				$("#sidebarAt span").text(responseData.ats ? responseData.ats : "");
				$("#sidebarMyComment span").text(responseData.comments ? responseData.comments : "");
				$("#sidebarPrivateMessage span").text(responseData.whispers ? responseData.whispers : "");
				if(responseData.followers && responseData.ats && 
					responseData.comments && responseData.whispers) {
					var html = template("messengerTemplate", { prompt: responseData });
					$("#messenger div[class='popover-content']").html(html);
					$("#messenger").removeClass("hidden");
				}
			} else {
				alert(responseData.error);
			}
		});
	}

	var bindEvent = function() {
		$().ready(function() {
			updateSidebar(function() {
				$(".nav-tabs a[href='#signedIn']").tab('show');
				$("#sidebarHome").click();
			}, function() {
				$(".nav-tabs a[href='#signIn']").tab('show');
			});
		});

		$("#signInButton").on("click", function(e) {
			var userName = $("#signInUserName").val();
			var password = $("#signInPassword").val();

			$.post("/account/doSignIn", {
				userName: userName,
				password: password
			}).done(function(responseData) {
				if(!responseData.error) {
					updateMessenger();

					id = responseData.id;
					if(responseData.icon) {
						$("#sidebarIcon").attr("src", toUploadPath(responseData.icon.path) + 
							responseData.icon.name);
					} else {
						$("#sidebarIcon").attr("src", "/uploads/default.ico");
					}
					$("#sidebarNickname").text(responseData.nickname);
					$("#sidebarFollowingCount").text(responseData.followings);
					$("#sidebarFollowerCount").text(responseData.followers);
					$("#sidebarBlogCount").text(responseData.blogs);
					$("#signIn")[0].reset();
					$(".nav-tabs a[href='#signedIn']").tab('show');
					$("#sidebarHome").click();
				} else {
					alert(responseData.error);
				}
			});
		});

		$("#signInGoToSignUp").on("click", function(e) {
			$(".nav-tabs a[href='#signUp']").tab('show');
		});

		$("#signUpButton").on("click", function(e) {
			var userName = $("#signUpUserName").val();
			var password = $("#signUpPassword").val();
			var confirmPassword = $("#signUpConfirmPassword").val();
			var nickname = $("#signUpNickname").val();
			var realName = $("#signUpRealName").val();
			var email = $("#signUpEmail").val();
			var birthday = $("#signUpBirthday").val();
			var sex = $("#signUpSex").val();
			var phone = $("#signUpPhone").val();
			var address = $("#signUpAddress").val();

			if(password !== confirmPassword) {
				alert("Password and confirm password is inconsistent.");
				return;
			}

			$.post("/account/doSignUp", {
				userName: userName,
				password: password,
				nickname: nickname,
				realName: realName,
				email: email,
				birthday: new Date(birthday).valueOf(),
				sex: Number(sex),
				phone: phone,
				address: address
			}).done(function(responseData) {
				if(!responseData.error) {
					$(".nav-tabs a[href='#signIn']").tab('show');
					$("#signUp")[0].reset();
				} else {
					alert(responseData.error);
				}
			});
		});

		$("#signUpReturn").on("click", function(e) {
			$(".nav-tabs a[href='#signIn']").tab('show');
		});

		$("#sidebarSearchButton").on("click", function(e) {
			var key = $("#templatemo_search_box").val();
			$.get("/blog/search/?key=" + key, function(responseData) {
				var html = template("contentMicroBloggingDetailBlogsTemplate", { blogs: responseData });
				$("#contentSearchBlogs").html(html);
			});
			$.get("/blog/searchBloggers/?key=" + key, function(responseData) {
				var html = template("contentSearchPeopleTemplate", { bloggers: responseData });
				$("#contentSearchPeople").html(html);
			});
			$(".nav-tabs a[href='#contentSearch']").tab('show');
		});

		$("#sidebarHome").on("click", function(e) {
			$.get("/blog/home", function(responseData) {
				var html = template("contentMicroBloggingDetailBlogsTemplate", { blogs: responseData });
				$("#contentHomeBlogs").html(html);
			});
			$(".nav-tabs a[href='#contentHome']").tab('show');
		});

		$("#sidebarAt").on("click", function(e) {
			var counter = 0;
			$.get("/at/blogAts", function(responseData) {
				var html = template("contentMicroBloggingDetailBlogsTemplate", { blogs: responseData });
				$("#contentAtBlog").html(html);
				++counter;
				if(counter === 2) {
					updateMessenger();
				}
			});
			$.get("/at/commentAts", function(responseData) {
				var html = template("contentMyCommentReceiveTemplate", { comments: responseData });
				$("#contentAtComment").html(html);
				++counter;
				if(counter === 2) {
					updateMessenger();
				}
			});
			$(".nav-tabs a[href='#contentAt']").tab('show');
		});

		$("#sidebarMyComment").on("click", function(e) {
			$.get("/comment/myReceivedComments", function(responseData) {
				var html = template("contentMyCommentReceiveTemplate", { comments: responseData });
				$("#contentMyCommentReceive").html(html);
				updateMessenger();
			});
			$.get("/comment/myIssuedComments", function(responseData) {
				var html = template("contentMyCommentIssueTemplate", { comments: responseData });
				$("#contentMyCommentIssue").html(html);
			});
			$(".nav-tabs a[href='#contentMyComment']").tab('show');
		});

		$("#sidebarPrivateMessage").on("click", function(e) {
			$(".nav-tabs a[href='#contentPrivateMessage']").tab('show');
		});

		$("#sidebarSetting").on("click", function(e) {
			updateSidebar(function(responseData) {
				$("#contentSettingBasicInfoNickName").val(responseData.nickname);
				$("#contentSettingBasicInfoRealName").val(responseData.realName);
				$("#contentSettingBasicInfoEmail").val(responseData.email);
				var date = new Date(responseData.birthday);
				$("#contentSettingBasicInfoBirthday").val(date.getFullYear() + "/" + 
					(date.getMonth() + 1) + "/" + date.getDate());
				$("#contentSettingBasicInfoSex").val(responseData.sex);
				$("#contentSettingBasicInfoPhone").val(responseData.phone);
				$("#contentSettingBasicInfoAddress").val(responseData.address);
				$("#contentSettingBasicInfoIntroduction").val(responseData.introduction);
				if(responseData.icon) {
					$("#contentSettingIconImg").attr("src", toUploadPath(responseData.icon.path) + 
						responseData.icon.name);
				} else {
					$("#contentSettingIconImg").attr("src", "/uploads/default.ico");
				}
				$(".nav-tabs a[href='#contentSetting']").tab('show');
			}, function() {
				alert("Please sign in first!");
				$(".nav-tabs a[href='#signIn']").tab('show');
			});
		});

		$("#sidebarSignOut").on("click", function(e) {
			$.get("/account/doSignOut", function() {
				$(".nav-tabs a[href='#signIn']").tab('show');
			});
		});

		$("#sidebarFollowings").on("click", function(e) {
			$.get("/account/followings?id=" + id, function(responseData) {
				var html = template("contentSearchPeopleTemplate", { bloggers: responseData });
				$("#contentFollowings").html(html);
				$(".nav-tabs a[href='#contentFollowings']").tab('show');
			});
		});

		$("#sidebarFollowers").on("click", function(e) {
			$.get("/account/followers?id=" + id, function(responseData) {
				var html = template("contentSearchPeopleTemplate", { bloggers: responseData });
				$("#contentFollowers").html(html);
				$(".nav-tabs a[href='#contentFollowers']").tab('show');
			});
		});

		$("#sidebarBlog, #sidebar .navbar-icon a").on("click", function(e) {
			$.get("/blog/bloggerInfo?id=" + id, function(responseData) {
				var html = template("contentMicroBloggingDetailInfoTemplate", { blogger: responseData });
				$("#contentMicroBloggingDetailInfoContainer").html(html);
			});
			$.get("/blog/blogs?id=" + id, function(responseData) {
				var html = template("contentMicroBloggingDetailBlogsTemplate", { blogs: responseData });
				$("#contentMicroBloggingDetailBlogsContainer").html(html);
			});
			$(".nav-tabs a[href='#contentMicroBloggingDetail']").tab('show');
		});

		$("#contentHomePublishBlogButton").on("click", function(e) {
			var content = $("#contentHomePublishBlogContent").val();
			$.post("/blog/publish", {
				content: content
			}).done(function(responseData) {
				if(!responseData.error) {
					$("#contentHome form")[0].reset();
					updateSidebar();
					$("#sidebarHome").click();
				} else {
					alert(responseData.error);
				}
			});
		});

		$("#contentSettingBasicInfoButton").on("click", function(e) {
			var nickname = $("#contentSettingBasicInfoNickName").val();
			var realName = $("#contentSettingBasicInfoRealName").val();
			var email = $("#contentSettingBasicInfoEmail").val();
			var birthday = $("#contentSettingBasicInfoBirthday").val();
			var sex = $("#contentSettingBasicInfoSex").val();
			var phone = $("#contentSettingBasicInfoPhone").val();
			var address = $("#contentSettingBasicInfoAddress").val();
			var introduction = $("#contentSettingBasicInfoIntroduction").val();

			$.post("/setting/updateInfo", {
				nickname: nickname,
				realName: realName,
				email: email,
				birthday: new Date(birthday).valueOf(),
				sex: Number(sex),
				phone: phone,
				address: address,
				introduction: introduction
			}).done(function(responseData) {
				if(responseData.error) {
					alert(responseData.error);
				}
			});
		});

		$("#contentSettingIconFrame").load(function() {
			updateSidebar();
			$("#sidebarSetting").click();
		});

		$("#contentSettingPasswordButton").on("click", function(e) {
			var originalPassword = $("#contentSettingOriginalPassword").val();
			var newPassword = $("#contentSettingNewPassword").val();
			var confirmPassword = $("#contentSettingConfirmPassword").val();

			if(newPassword !== confirmPassword) {
				alert("New password and confirm password is inconsistent.");
				return;
			}

			$.post("/setting/changePassword", {
				originalPassword: originalPassword,
				newPassword: newPassword
			}).done(function(responseData) {
				if(!responseData.error) {
					$(".nav-tabs a[href='#signIn']").tab('show');
					$("#contentSettingPassword form")[0].reset();
				} else {
					alert(responseData.error);
				}
			});
		});

		$("#contentFollowings, #contentFollowers, #contentSearchPeople, " + 
			"#contentMicroBloggingDetailInfoContainer").on("click", "[click-action]", function() {
			var target = $(this);
			var action = target.attr("click-action");
			var container = target.closest("div[id]");
			var accountId = container.attr("id");
			switch(action) {
				case "personal":
				case "blogs":
					$.get("/blog/bloggerInfo?id=" + accountId, function(responseData) {
						var html = template("contentMicroBloggingDetailInfoTemplate", { blogger: responseData });
						$("#contentMicroBloggingDetailInfoContainer").html(html);
					});
					$.get("/blog/blogs?id=" + accountId, function(responseData) {
						var html = template("contentMicroBloggingDetailBlogsTemplate", { blogs: responseData });
						$("#contentMicroBloggingDetailBlogsContainer").html(html);
					});
					$(".nav-tabs a[href='#contentMicroBloggingDetail']").tab('show');
					break;

				case "follow":
					$.post("/account/follow", {
						id: accountId
					}).done(function(responseData) {
						if(!responseData.error) {
							$("#sidebarSearchButton").click();
							updateSidebar();
						} else {
							alert(responseData.error);
						}
					});
					break;

				case "unfollow":
					$.post("/account/unfollow", {
						id: accountId
					}).done(function(responseData) {
						if(!responseData.error) {
							$("#sidebarSearchButton").click();
							updateSidebar();
						} else {
							alert(responseData.error);
						}
					});
					break;

				case "whisper":
					break;

				case "followings":
					$.get("/account/followings?id=" + accountId, function(responseData) {
						var html = template("contentSearchPeopleTemplate", { bloggers: responseData });
						$("#contentFollowings").html(html);
						$(".nav-tabs a[href='#contentFollowings']").tab('show');
					});
					break;

				case "followers":
					$.get("/account/followers?id=" + accountId, function(responseData) {
						var html = template("contentSearchPeopleTemplate", { bloggers: responseData });
						$("#contentFollowers").html(html);
						$(".nav-tabs a[href='#contentFollowers']").tab('show');
					});
					break;

				default:
					break;
			}
		});

		$("#contentSearchBlogs, #contentHomeBlogs, #contentAtBlog, " + 
			"#contentMicroBloggingDetailBlogsContainer").on("click", "[click-action]", function() {
			var target = $(this);
			var action = target.attr("click-action");
			var container = target.closest("div[id]");
			var blogId = container.attr("id");
			if(blogId.indexOf("_") !== -1) {
				blogId = blogId.substring(blogId.indexOf("_") + 1);
			}
			switch(action) {
				case "personal":
					var accountId = target.attr("account-id");
					$.get("/blog/bloggerInfo?id=" + accountId, function(responseData) {
						var html = template("contentMicroBloggingDetailInfoTemplate", { blogger: responseData });
						$("#contentMicroBloggingDetailInfoContainer").html(html);
					});
					$.get("/blog/blogs?id=" + accountId, function(responseData) {
						var html = template("contentMicroBloggingDetailBlogsTemplate", { blogs: responseData });
						$("#contentMicroBloggingDetailBlogsContainer").html(html);
					});
					$(".nav-tabs a[href='#contentMicroBloggingDetail']").tab('show');
					break;

				case "comment":
					$("#comment_" + blogId).toggleClass("hidden");
					$.get("/comment/blogComments?id=" + blogId, function(responseData) {
						var html = template("contentMicroBloggingDetailBlogsCommentTemplate", {
							comments: responseData
						});
						$("#commentContainer_" + blogId).html(html);
					});
					break;

				case "forward":
					break;

				case "great":
					$.post("/blog/great", {
						id: blogId
					}).done(function(responseData) {
						if(!responseData.error) {
							var match = target.text().match(/(\d+)/);
							var greats;
							if(match) {
								greats = Number(match[0]) + 1;
							} else {
								greats = 1;
							}
							target.find("span").text("(" + greats + ")");
						} else {
							alert(responseData.error);
						}
					});
					break;

				case "commentButton":
					var comment = container.find("input[type='text']").val();
					var commentId = container.find("input[type='hidden']").val();
					var param = {
						blogId: blogId,
						content: comment
					};
					if(commentId) {
						param.commentId = commentId;
					}
					$.post("/comment/publish", param).done(function(responseData) {
						if(!responseData.error) {
							container.find("form")[0].reset();
							$.get("/comment/blogComments?id=" + blogId, function(responseData) {
								if(!responseData.error) {
									var commentCounterNode = $("#" + blogId).find("a[click-action='comment'] span");
									var match = commentCounterNode.text().match(/(\d+)/);
									var comments;
									if(match) {
										comments = Number(match[0]) + 1;
									} else {
										comments = 1;
									}
									commentCounterNode.text("(" + comments + ")");
									var html = template("contentMicroBloggingDetailBlogsCommentTemplate", {
										comments: responseData
									});
									$("#commentContainer_" + blogId).html(html);
								} else {
									alert(responseData.error);
								}
							});
						} else {
							alert(responseData.error);
						}
					});
					break;

				case "commentGreat":
					var commentId = blogId;
					$.post("/comment/great", {
						id: commentId
					}).done(function(responseData) {
						if(!responseData.error) {
							var match = target.text().match(/(\d+)/);
							var greats;
							if(match) {
								greats = Number(match[0]) + 1;
							} else {
								greats = 1;
							}
							target.find("span").text("(" + greats + ")");
						} else {
							alert(responseData.error);
						}
					});
					break;

				case "commentReply":
					var commentId = blogId;
					blogId = container.parent().attr("id");
					blogId = blogId.substring(blogId.indexOf("_") + 1);
					var commentsContainer = $("#comment_" + blogId);
					commentsContainer.find("input[type='hidden']").val(commentId);
					commentsContainer.find("input[type='text']").attr("placeholder", 
						"@" + container.find("h5 a").text() + ":");
					break;

				default:
					break;
			}
		});

		$("#contentAtComment, #contentMyCommentReceive, " + 
			"#contentMyCommentIssue").on("click", "[click-action]", function() {
			var target = $(this);
			var action = target.attr("click-action");
			var container = target.closest("div[id]");
			var commentId = container.attr("id");
			switch(action) {
				case "personal":
					var accountId = target.attr("account-id");
					$.get("/blog/bloggerInfo?id=" + accountId, function(responseData) {
						var html = template("contentMicroBloggingDetailInfoTemplate", { blogger: responseData });
						$("#contentMicroBloggingDetailInfoContainer").html(html);
					});
					$.get("/blog/blogs?id=" + accountId, function(responseData) {
						var html = template("contentMicroBloggingDetailBlogsTemplate", { blogs: responseData });
						$("#contentMicroBloggingDetailBlogsContainer").html(html);
					});
					$(".nav-tabs a[href='#contentMicroBloggingDetail']").tab('show');
					break;

				case "replyButton":
					$("#commentBox_" + commentId).toggleClass("hidden");
					break;

				case "reply":
					var comment = container.find("input[type='text']").val();
					commentId = commentId.substring(commentId.indexOf("_") + 1);
					var blogId = container.attr("blog-id");
					$.post("/comment/publish", {
						blogId: blogId,
						commentId: commentId,
						content: comment
					}).done(function(responseData) {
						if(!responseData.error) {
							container.find("form")[0].reset();
							$.get("/comment/blogComments?id=" + blogId, function(responseData) {
								if(!responseData.error) {
									$("#sidebarMyComment").click();
									alert("回复成功！");
								} else {
									alert(responseData.error);
								}
							});
						} else {
							alert(responseData.error);
						}
					});
					break;

				default:
					break;
			}
		});

		$("#messenger div[class='popover-content']").on("click", "[click-action]", function() {
			var target = $(this);
			var action = target.attr("click-action");
			switch(action) {
				case "follower":
					$("#sidebarFollowers").click();
					break;

				case "at":
					$("#sidebarAt").click();
					break;

				case "comment":
					$("#sidebarMyComment").click();
					break;

				case "whisper":
					break;

				default:
					break;
			}
		});

		$("#messengerButton").on("click", function(e) {
			$("#messenger").addClass("hidden");
		});

		$("#whisperMiniBox").on("click", function(e) {
			$(".nav-tabs a[href='#whisperBox']").tab('show');
		});

		$("#whisperBoxMinimize").on("click", function(e) {
			$(".nav-tabs a[href='#whisperMiniBox']").tab('show');
		});

		$("#whisperBoxClose").on("click", function(e) {
			$("#whisperBox ul, #whisperBox .tab-content").empty();
			$("#whisper, #whisperBox").addClass("hidden");
		});

		$(".pull-right button").each(function(index) {
			if($(this).text() === "私信") {
				$(this).on("click", function(e) {
					$("#whisper").removeClass("hidden");
					$(".nav-tabs a[href='#whisperMiniBox']").tab('show');
				});
			}
		});
	};

	var toUploadPath = function(path) {
		return "/uploads/" + path.match(/.{1,4}/g).join("/") + "/";
	};

	var extendTemplate = function() {
		template.helper('dateFormat', function (date, format) {
    		date = new Date(date);
    		var map = {
        		"M": date.getMonth() + 1, //月份 
        		"d": date.getDate(), //日 
        		"h": date.getHours(), //小时 
        		"m": date.getMinutes(), //分 
        		"s": date.getSeconds(), //秒 
        		"q": Math.floor((date.getMonth() + 3) / 3), //季度 
        		"S": date.getMilliseconds() //毫秒 
    		};

	    	format = format.replace(/([yMdhmsqS])+/g, function(all, t){
    	    	var v = map[t];
    	    	if(v !== undefined){
    	    		if(all.length > 1){
    	    			v = '0' + v;
    	    			v = v.substr(v.length-2);
    	    		}
    	    		return v;
    	    	}
    	    	else if(t === 'y'){
    	    		return (date.getFullYear() + '').substr(4 - all.length);
    	    	}
    	    	return all;
    		});
    		return format;
    	});

    	template.helper("toUploadPath", toUploadPath);
    };

	app.getId = function() {
		return id;
	};

	app.init = function() {
		bindEvent();
		extendTemplate();

		$("#signUpBirthday, #contentSettingBasicInfoBirthday").datetimepicker({
			format:'Y/m/d',
            timepicker: false
		});
	};

	return app;
})();

app.init();