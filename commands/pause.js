module.exports = {
	name: "pause",
	description: "Met en pause la musique jouée",
	category: "Musique",
	args: "",
	execute: function (client, message, args) {
		const Utils = require("../utils.js");

		Utils.log(this.name, message);
		if (typeof client.audio !== "undefined" && client.audio !== null) {
			client.audio.pause();
			message.react("⏸");
		}
	}
};