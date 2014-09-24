var app = (function() {
	var app = {};

	var toggle = function(target) {
		$("#sidebarHome").removeClass("active");
		$("#sidebarAt").removeClass("active");
		$("#sidebarMyComment").removeClass("active");
		$("#sidebarPrivateMessage").removeClass("active");
		$("#sidebarSetting").removeClass("active");
		$("#sidebarSignOut").removeClass("active");

		$("#contentHome").addClass("hidden");
		$("#contentAt").addClass("hidden");
		$("#contentMyComment").addClass("hidden");
		$("#contentPrivateMessage").addClass("hidden");
		$("#contentSetting").addClass("hidden");
		$("#contentFocus").addClass("hidden");
		$("#contentFans").addClass("hidden");
		$("#contentSearch").addClass("hidden");

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
				$("#sidebar").addClass("hidden");
				$("#content").addClass("hidden");
				$("#signIn").removeClass("hidden");
				break;

			default:
				break;
		}
	};

	var bindEvent = function() {
		$("#sidebarHome").on("click", function(e) {
			/*
			var lastActived = $("ul.templatemo-sidebar-menu li.active");
			lastActived.removeClass("active");
			lastActived.attr("id");
			*/
			toggle($(e.target));
		});
		$("#sidebarAt").on("click", function(e) {
			toggle($(e.target));
		});
		$("#sidebarMyComment").on("click", function(e) {
			toggle($(e.target));
		});
		$("#sidebarPrivateMessage").on("click", function(e) {
			toggle($(e.target));
		});
		$("#sidebarSetting").on("click", function(e) {
			toggle($(e.target));
		});
		$("#sidebarSignOut").on("click", function(e) {
			toggle($(e.target));
		});
		$("#signInButton").on("click", function(e) {
			$("#signIn").addClass("hidden");
			$("#sidebar").removeClass("hidden");
			$("#content").removeClass("hidden");
			$("#sidebarHome").addClass("active");
			$("#contentHome").removeClass("hidden");
		});
		$("#signInGoToSignUp").on("click", function(e) {
			$("#signIn").addClass("hidden");
			$("#sidebar").addClass("hidden");
			$("#content").addClass("hidden");
			$("#signUp").removeClass("hidden");
		});
		$("#signUpButton").on("click", function(e) {
			$("#signUp").addClass("hidden");
			$("#sidebar").addClass("hidden");
			$("#content").addClass("hidden");
			$("#signIn").removeClass("hidden");
		});
		$("#signUpReturn").on("click", function(e) {
			$("#signUp").addClass("hidden");
			$("#sidebar").addClass("hidden");
			$("#content").addClass("hidden");
			$("#signIn").removeClass("hidden");
		});
		$("#sidebarFocus").on("click", function(e) {
			$("#sidebarHome").removeClass("active");
			$("#sidebarAt").removeClass("active");
			$("#sidebarMyComment").removeClass("active");
			$("#sidebarPrivateMessage").removeClass("active");
			$("#sidebarSetting").removeClass("active");
			$("#sidebarSignOut").removeClass("active");

			$("#contentHome").addClass("hidden");
			$("#contentAt").addClass("hidden");
			$("#contentMyComment").addClass("hidden");
			$("#contentPrivateMessage").addClass("hidden");
			$("#contentSetting").addClass("hidden");
			$("#contentFans").addClass("hidden");
			$("#contentSearch").addClass("hidden");
			$("#contentFocus").removeClass("hidden");
		});
		$("#sidebarFans").on("click", function(e) {
			$("#sidebarHome").removeClass("active");
			$("#sidebarAt").removeClass("active");
			$("#sidebarMyComment").removeClass("active");
			$("#sidebarPrivateMessage").removeClass("active");
			$("#sidebarSetting").removeClass("active");
			$("#sidebarSignOut").removeClass("active");

			$("#contentHome").addClass("hidden");
			$("#contentAt").addClass("hidden");
			$("#contentMyComment").addClass("hidden");
			$("#contentPrivateMessage").addClass("hidden");
			$("#contentSetting").addClass("hidden");
			$("#contentFocus").addClass("hidden");
			$("#contentSearch").addClass("hidden");
			$("#contentFans").removeClass("hidden");
		});
		$("#sidebarBlog").on("click", function(e) {
			$("#sidebarHome a").trigger("click");
		});
		$("#searchButton").on("click", function(e) {
			$("#sidebarHome").removeClass("active");
			$("#sidebarAt").removeClass("active");
			$("#sidebarMyComment").removeClass("active");
			$("#sidebarPrivateMessage").removeClass("active");
			$("#sidebarSetting").removeClass("active");
			$("#sidebarSignOut").removeClass("active");

			$("#contentHome").addClass("hidden");
			$("#contentAt").addClass("hidden");
			$("#contentMyComment").addClass("hidden");
			$("#contentPrivateMessage").addClass("hidden");
			$("#contentFocus").addClass("hidden");
			$("#contentFans").addClass("hidden");
			$("#contentSetting").addClass("hidden");
			$("#contentSearch").removeClass("hidden");
		});
	};

	app.init = function() {
		bindEvent();
		var datepicker = {
			format:'Y/m/d',
            timepicker: false
		};
		$("#birthday").datetimepicker(datepicker);
        $("#signUpBirthday").datetimepicker(datepicker);
	};

	return app;
})();

app.init();