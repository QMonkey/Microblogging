var app = (function() {
	var app = {};

	var bindEvent = function() {
		$("#signInButton").on("click", function(e) {
			$(".nav-tabs a[href='#signedIn']").tab('show');
		});

		$("#signInGoToSignUp").on("click", function(e) {
			$(".nav-tabs a[href='#signUp']").tab('show');
		});

		$("#signUpButton").on("click", function(e) {
			$(".nav-tabs a[href='#signIn']").tab('show');
		});

		$("#signUpReturn").on("click", function(e) {
			$(".nav-tabs a[href='#signIn']").tab('show');
		});

		$("#sidebarHome, #sidebarBlog, #sidebar .navbar-icon a").on("click", function(e) {
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
			$(".nav-tabs a[href='#signIn']").tab('show');
		});

		$("#sidebarFocus").on("click", function(e) {
			$(".nav-tabs a[href='#contentFocus']").tab('show');
		});

		$("#sidebarFans").on("click", function(e) {
			$(".nav-tabs a[href='#contentFans']").tab('show');
		});

		$("#searchButton").on("click", function(e) {
			$(".nav-tabs a[href='#contentSearch']").tab('show');
		});

		$("#content h4, #content h5, #content img").on("click", function(e) {
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