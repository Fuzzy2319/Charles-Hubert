module.exports = {
	name: "next",
	description: "Passe à la musique suivante",
	category: "Musique",
	args: "",
	execute: function (client, message, args) {
		const Utils = require("../utils.js");

		Utils.log(this.name, message);
		if (typeof client.audio !== "undefined" && client.audio !== null && typeof client.queue !== "undefined" && client.queue.length > 1) {
			client.queue.shift();
			Utils.play(client);
			message.react("⏩");
		}
	}
};