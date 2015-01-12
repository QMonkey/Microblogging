var express = require("express");
var path = require("path");
var router = express.Router();

router.get("/", function(request, response) {
	response.sendFile(path.join(path.dirname(module.parent.filename), "views", "index.html"));
});

module.exports = router;