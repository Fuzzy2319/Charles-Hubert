module.exports = {
	name: "resume",
	description: "Reprend la musique en pause",
	category: "Musique",
	args: "",
	execute: function (client, message, args) {
		const Utils = require("../utils.js");

		Utils.log(this.name, message);
		if (typeof client.audio !== "undefined" && client.audio !== null) {
			client.audio.resume();
			client.audio.pause();
			client.audio.resume();
			message.react("▶");
		}
	}
};