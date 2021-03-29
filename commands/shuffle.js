module.exports = {
	name: "shuffle",
	description: "Mélange la musique en attente",
	category: "Musique",
	execute: function (client, message, args) {
		const Utils = require("../utils.js");

		Utils.log(this.name, message);
		if (typeof client.audio !== "undefined" && client.audio !== null && typeof client.queue !== "undefined" && client.queue.length > 1) {
			client.queue = Utils.shuffle(client.queue);
			Utils.play(client);
			message.react("🔀");
		}
	}
};