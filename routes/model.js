var mongoose = require("mongoose");

var AccountSchema = new mongoose.Schema({
	userName: String,
	password: String,
	realName: String
});

module.exports.Account = mongoose.model("Account", AccountSchema, "Account");