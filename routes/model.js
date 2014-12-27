var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
	userName: { type: String, require: true },
	password: { type: String, require: true },
	salt: { type: String, require: true },
	nickname: String,
	realName: String,
	email: String,
	birthday: Number,
	sex: Number,
	phone: String,
	address: String,
	introduction: String,
	followings: [{ type: Schema.Types.ObjectId, ref: "Account" }],
	followers: [{ type: Schema.Types.ObjectId, ref: "Account" }],
	blogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

var BlogSchema = new Schema({
	content: { type: String, default: null },
	publisher: { type: Schema.Types.ObjectId, ref: "Account" },
	publishTime: { type: Number, default: Date.now() },
	forward: { type: Schema.Types.ObjectId, ref: "Blog", default: null },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	ats: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	greats: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

var CommentSchema = new Schema({
	content: { type: String, default: null },
	publisher: { type: Schema.Types.ObjectId, ref: "Account" },
	publishTime: { type: Number, default: Date.now() },
	receiveTime: { type: Number, default: 0 },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	ats: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	greats: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

var MessageSchema = new Schema({
	content: { type: String, default: null },
	sendTime: { type: Number, default: Date.now() },
	receiveTime: { type: Number, default: 0 },
	sender: { type: Schema.Types.ObjectId, ref: "Account" },
	receiver: { type: Schema.Types.ObjectId, ref: "Account", default: null },
	type: { type: String, default: "great" }	//great, at, whisper
});

module.exports.Account = mongoose.model("Account", AccountSchema, "Account");
module.exports.Blog = mongoose.model("Blog", BlogSchema, "Blog");
module.exports.Comment = mongoose.model("Comment", CommentSchema, "Comment");
module.exports.Message = mongoose.model("Message", MessageSchema, "Message");