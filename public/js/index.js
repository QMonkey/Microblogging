var app = (function() {
	var app = {};

	var bindEvent = function() {
		$().ready(function() {
			$.get("/account/current", function(responseData) {
				if(responseData.id) {
					$("#sidebarNickname").text(responseData.info.nickname);
					$("#sidebarFollowCount").text();
					$("#sidebarFansCount").text();
					$("#sidebarBlogCount").text();
					$(".nav-tabs a[href='#signedIn']").tab('show');
					$("#sidebarHome").click();
				} else {
					$(".nav-tabs a[href='#signIn']").tab('show');
				}
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
					$("#sidebarNickname").text(responseData.info.nickname);
					$("#sidebarFollowCount").text();
					$("#sidebarFansCount").text();
					$("#sidebarBlogCount").text();
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
				alert("Password and confirmPassword is inconsistent.");
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

		$("#sidebarHome").on("click", function(e) {
			$(".nav-tabs a[href='#contentHome']").tab('show');
		});

		$("#sidebarAt").on("click", function(e) {
			$(".nav-tabs a[href='#contentAt']").tab('show');
		});

		$("#sidebarMyComment").on("click", function(e) {
			$(".nav-tabs a[href='#contentMyComment']").tab('show');
		});

		$("#sidebarPrivateMessage").on("click", function(e) {
			$(".nav-tabs a[href='#contentPrivateMessage']").tab('show');
		});

		$("#sidebarSetting").on("click", function(e) {
			$(".nav-tabs a[href='#contentSetting']").tab('show');
		});

		$("#sidebarSignOut").on("click", function(e) {
			$.get("/account/doSignOut", function(data) {
				$(".nav-tabs a[href='#signIn']").tab('show');
			});
		});

		$("#sidebarFollow").on("click", function(e) {
			$(".nav-tabs a[href='#contentFollow']").tab('show');
		});

		$("#sidebarFans").on("click", function(e) {
			$(".nav-tabs a[href='#contentFans']").tab('show');
		});

		$("#searchButton").on("click", function(e) {
			$(".nav-tabs a[href='#contentSearch']").tab('show');
		});

		$("#sidebarBlog, #sidebar .navbar-icon a, " + 
			"#content h4, #content h5, #content img").on("click", function(e) {
			$(".nav-tabs a[href='#contentMicroBloggingDetail']").tab('show');
		});

		$("#content img").on("mouseover", function(e) {
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

	app.init = function() {
		bindEvent();

		$("#signUpBirthday, #contentSettingBasicInfoBirthday").datetimepicker({
			format:'Y/m/d',
            timepicker: false
		});
	};

	return app;
})();

app.init();