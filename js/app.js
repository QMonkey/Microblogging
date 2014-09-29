var app = (function() {
	var app = {};

	var disactivateSidebar = function() {
		$("#sidebarHome, #sidebarAt, #sidebarMyComment, #sidebarPrivateMessage, " + 
			"#sidebarSetting, #sidebarSignOut").removeClass("active");
	};

	var hideContent = function() {
		$("#contentHome, #contentAt, #contentMyComment, #contentPrivateMessage, " + 
			"#contentSetting, #contentFocus, #contentFans, " + 
			"#contentMicroBloggingDetail, #contentSearch").addClass("hidden");
	};

	var toggle = function(target) {
		disactivateSidebar();
		hideContent();

		switch(target.parent("li").attr("id")) {
			case "sidebarHome":
				$("#contentHome").removeClass("hidden");
				$("#sidebarHome").addClass("active");
				break;

			case "sidebarAt":
				$("#contentAt").removeClass("hidden");
				$("#sidebarAt").addClass("active");
				break;

			case "sidebarMyComment":
				$("#contentMyComment").removeClass("hidden");
				$("#sidebarMyComment").addClass("active");
				break;

			case "sidebarPrivateMessage":
				$("#contentPrivateMessage").removeClass("hidden");
				$("#sidebarPrivateMessage").addClass("active");
				break;

			case "sidebarSetting":
				$("#contentSetting").removeClass("hidden");
				$("#sidebarSetting").addClass("active");
				break;

			case "sidebarSignOut":
				$("#sidebar, #content, #messenger, #whisper, #whisperMiniBox, #whisperBox").addClass("hidden");
				$("#signIn").removeClass("hidden");
				break;

			default:
				break;
		}
	};

	var bindEvent = function() {
		$("#sidebarHome, #sidebarAt, #sidebarMyComment, #sidebarPrivateMessage, " + 
			"#sidebarSetting, #sidebarSignOut").on("click", function(e) {
			toggle($(e.target));
		});

		$("#signInButton").on("click", function(e) {
			$("#signIn").addClass("hidden");
			$("#sidebarHome").addClass("active");
			$("#sidebar, #content, #contentHome, #messenger, #whisper, #whisperMiniBox").removeClass("hidden");
		});

		$("#signInGoToSignUp").on("click", function(e) {
			$("#signIn, #sidebar, #content").addClass("hidden");
			$("#signUp").removeClass("hidden");
		});

		$("#signUpButton").on("click", function(e) {
			$("#signUp, #sidebar, #content").addClass("hidden");
			$("#signIn").removeClass("hidden");
		});

		$("#signUpReturn").on("click", function(e) {
			$("#signUp, #sidebar, #content").addClass("hidden");
			$("#signIn").removeClass("hidden");
		});

		$("#sidebarFocus").on("click", function(e) {
			disactivateSidebar();
			hideContent();
			$("#contentFocus").removeClass("hidden");
		});

		$("#sidebarFans").on("click", function(e) {
			disactivateSidebar();
			hideContent();
			$("#contentFans").removeClass("hidden");
		});

		$("#sidebarBlog").on("click", function(e) {
			$("#sidebarHome a").trigger("click");
		});

		$("#searchButton").on("click", function(e) {
			disactivateSidebar();
			hideContent();
			$("#contentSearch").removeClass("hidden");
		});

		$("#content h4, #content h5, #content img").on("click", function(e) {
			disactivateSidebar();
			hideContent();
			$("#contentMicroBloggingDetail").removeClass("hidden");
		});

		$("#sidebar .navbar-icon a").on("click", function(e) {
			disactivateSidebar();
			hideContent();
			$("#sidebarHome").addClass("active");
			$("#contentHome").removeClass("hidden");
		});

		$("#content img").on("mouseover", function(e) {
		});

		$("#messengerButton").on("click", function(e) {
			$("#messenger").addClass("hidden");
		});

		$("#whisperMiniBox").on("click", function(e) {
			$("#whisperMiniBox").addClass("hidden");
			$("#whisperBox").removeClass("hidden");
		});

		$("#whisperBoxMinimize").on("click", function(e) {
			$("#whisperBox").addClass("hidden");
			$("#whisperMiniBox").removeClass("hidden");
		});

		$("#whisperBoxClose").on("click", function(e) {
			$("#whisperBox ul, #whisperBox .tab-content").empty();
			$("#whisper, #whisperBox").addClass("hidden");
		});

		$(".pull-right button").each(function(index) {
			if($(this).text() === "私信") {
				$(this).on("click", function(e) {
					$("#whisper, #whisperBox").removeClass("hidden");
					$("#whisperMiniBox").addClass("hidden");
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