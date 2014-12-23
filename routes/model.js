var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
	userName: { type: String, require: true },
	password: { type: String, require: true },
	salt: { type: String, require: true },
	info: { type: Schema.Types.ObjectId, ref: "AccountInfo" },
	followings: [{ type: Schema.Types.ObjectId, ref: "Account" }], 
	followers: [{ type: Schema.Types.ObjectId, ref: "Account" }],
	blogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

var AccountInfoSchema = new Schema({
	nickname: String,
	realName: String,
	email: String,
	birthday: Number,
	sex: Number,
	phone: String,
	address: String,
	introduction: String
});

var BlogSchema = new Schema({
	content: { type: String, default: null },
	publishTime: { type: Number, default: Date.now() },
	forward: { type: Schema.Types.ObjectId, ref: "Blog" },
	comments: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	ats: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	greats: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

var MessageSchema = new Schema({
	content: { type: String, default: null },
	sendTime: { type: Number, default: Date.now() },
	receiveTime: { type: Number, default: 0 },
	receiver: { type: Schema.Types.ObjectId, ref: "Account", default: null },
	type: { type: String, default: "comment" }	//comment, great, at, whisper
});

module.exports.Account = mongoose.model("Account", AccountSchema, "Account");
module.exports.AccountInfo = mongoose.model("AccountInfo", AccountInfoSchema, "AccountInfo");
module.exports.Blog = mongoose.model("Blog", BlogSchema, "Blog");
module.exports.Message = mongoose.model("Message", MessageSchema, "Message");