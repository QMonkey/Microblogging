var express = require("express");
var mongoose = require("mongoose");

var model = require("./model");

module.exports = function(app, io) {
	io.on("connection", function(socket) {
		var accountMap = app.get("accountMap");

		socket.on("signIn", function(data) {
			var id = data.id;
			model.Account.findById(id, function(err, account) {
				var infos;
				if(account) {
					if(!accountMap[id]) {
						accountMap[id] = [];
					}
					if((infos = accountMap[id].filter(function(info) {
						return info.socketId === socket.id;
					})).length > 0) {
						infos[0].online = true;
					} else {
						accountMap[id].push({
							socketId: socket.id,
							online: true
						});
					}
				}
			});
		});

		socket.on("signOut", function(data) {
			var id = data.id;
			if(id && accountMap[id]) {
				accountMap[id].forEach(function(info) {
					if(socket.id === info.socketId) {
						info.online = false;
					}
				});
			}
		});

		socket.on("disconnect", function() {
			Object.keys(accountMap).forEach(function(key) {
				accountMap[key].forEach(function(info, index, self) {
					if(socket.id === info.socketId) {
						self.splice(index, 1);
						if(self.length === 0) {
							delete accountMap[key];
						}
					}
				});
			});
		});
	});
};