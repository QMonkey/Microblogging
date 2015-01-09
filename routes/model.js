var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
	userName: { type: String, unique: true, require: true },
	password: { type: String, require: true },
	salt: { type: String, require: true },
	nickname: { type: String, unique: true, require: true },
	realName: String,
	email: String,
	birthday: Number,
	sex: Number,
	phone: String,
	address: String,
	introduction: String,
	icon: { type: Schema.Types.ObjectId, ref: "File", default: null },
	followings: [{ type: Schema.Types.ObjectId, ref: "Account" }],
	followers: [{ type: Schema.Types.ObjectId, ref: "Account" }],
	blogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

var FileSchema = new Schema({
	name: { type: String, require: true },
	path: { type: String, require: true },
	mimeType: { type: String, require: true }
});

var BlogSchema = new Schema({
	content: { type: String, require: true },
	publisher: { type: Schema.Types.ObjectId, ref: "Account", require: true },
	publishTime: { type: Number, require: true },
	forward: { type: Schema.Types.ObjectId, ref: "Blog", default: null },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	ats: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	greats: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

var CommentSchema = new Schema({
	content: { type: String, require: true },
	publisher: { type: Schema.Types.ObjectId, ref: "Account", require: true },
	receiver: { type: Schema.Types.ObjectId, ref: "Account", require: true },
	publishTime: { type: Number, require: true},
	receiveTime: { type: Number, default: 0 },
	blog: { type: Schema.Types.ObjectId, ref: "Blog", require: true },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	ats: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	greats: [{ type: Schema.Types.ObjectId, ref: "Message" }]
});

var MessageSchema = new Schema({
	content: { type: String, default: null },
	sender: { type: Schema.Types.ObjectId, ref: "Account", require: true },
	receiver: { type: Schema.Types.ObjectId, ref: "Account", default: null },
	sendTime: { type: Number, require: true },
	receiveTime: { type: Number, default: 0 },
	type: { type: String, default: "great" }	//great, at, whisper
});

module.exports.Account = mongoose.model("Account", AccountSchema, "Account");
module.exports.File = mongoose.model("File", FileSchema, "File");
module.exports.Blog = mongoose.model("Blog", BlogSchema, "Blog");
module.exports.Comment = mongoose.model("Comment", CommentSchema, "Comment");
module.exports.Message = mongoose.model("Message", MessageSchema, "Message");