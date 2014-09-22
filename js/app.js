var app = (function() {
	var app = {};

	var toggle = function(target) {
		$("#homeMenu").removeClass("active");
		$("#atMenu").removeClass("active");
		$("#myCommentMenu").removeClass("active");
		$("#privateMessageMenu").removeClass("active");
		$("#settingMenu").removeClass("active");
		$("#signOutMenu").removeClass("active");

		$("#home").addClass("hidden");
		$("#at").addClass("hidden");
		$("#myComment").addClass("hidden");
		$("#privateMessage").addClass("hidden");
		$("#setting").addClass("hidden");

		switch(target.parent("li").attr("id")) {
			case "homeMenu":
				$("#home").removeClass("hidden");
				$("#homeMenu").addClass("active");
				break;

			case "atMenu":
				$("#at").removeClass("hidden");
				$("#atMenu").addClass("active");
				break;

			case "myCommentMenu":
				$("#myComment").removeClass("hidden");
				$("#myCommentMenu").addClass("active");
				break;

			case "privateMessageMenu":
				$("#privateMessage").removeClass("hidden");
				$("#privateMessageMenu").addClass("active");
				break;

			case "settingMenu":
				$("#setting").removeClass("hidden");
				$("#settingMenu").addClass("active");
				break;

			case "signOutMenu":
				$("#sidebar").addClass("hidden");
				$("#content").addClass("hidden");
				$("#signIn").removeClass("hidden");
				break;

			default:
				break;
		}
	};

	var bindEvent = function() {
		$("#homeMenu").on("click", function(e) {
			toggle($(e.target));
		});
		$("#atMenu").on("click", function(e) {
			toggle($(e.target));
		});
		$("#myCommentMenu").on("click", function(e) {
			toggle($(e.target));
		});
		$("#privateMessageMenu").on("click", function(e) {
			toggle($(e.target));
		});
		$("#settingMenu").on("click", function(e) {
			toggle($(e.target));
		});
		$("#signOutMenu").on("click", function(e) {
			toggle($(e.target));
		});
		$("#signInButton").on("click", function(e) {
			$("#signIn").addClass("hidden");
			$("#sidebar").removeClass("hidden");
			$("#content").removeClass("hidden");
			$("#homeMenu").addClass("active");
			$("#home").removeClass("hidden");
		});
	};

	app.init = function() {
		bindEvent();
		$( "#birthday" ).datetimepicker({
       		format:'Y/m/d',
            timepicker: false
        });
	};

	return app;
})();

app.init();