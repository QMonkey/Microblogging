var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
	userName: { type: String, require: true },
	password: { type: String, require: true },
	salt: { type: String, require: true },
	info: { type: Schema.Types.ObjectId, ref: "AccountInfo" },
	followings: [{ type: Schema.Types.ObjectId, ref: "Account" }], 
	followers: [{ type: Schema.Types.ObjectId, ref: "Account" }],
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	ats: [{ type: Schema.Types.ObjectId, ref: "At" }],
	whispers: [{ type: Schema.Types.ObjectId, ref: "Whisper" }]
});

var AccountInfoSchema = new Schema({
	nickname: String,
	realName: String,
	email: String,
	birthday: Number,
	sex: Number,
	phone: String,
	address: String
});

var MessageSchema = new Schema({
	content: { type: String, require: true },
	publishTime: Number,
	great: { type: Number, default: 0 },
	message: { type: Schema.Types.ObjectId, ref: "Message" },
	type: { type: Number, default: 0 }
});

var AtSchema = new Schema({
	receiver: { type: Schema.Types.ObjectId, ref: "Account", require: true },
	message: { type: Schema.Types.ObjectId, ref: "Message", require: true }
});

var WhisperSchema = new Schema({
	receiver: { type: Schema.Types.ObjectId, ref: "Account", require: true },
	content: { type: String, require: true },
	sendTime: Number,
	receiveTime: { type: Number, default: 0 }
});

module.exports.Account = mongoose.model("Account", AccountSchema, "Account");
module.exports.AccountInfo = mongoose.model("AccountInfo", AccountInfoSchema, "AccountInfo");
module.exports.Message = mongoose.model("Message", MessageSchema, "Message");
module.exports.At = mongoose.model("At", AtSchema, "At");
module.exports.Whisper = mongoose.model("Whisper", WhisperSchema, "Whisper");