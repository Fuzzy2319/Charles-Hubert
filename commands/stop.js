module.exports = {
	name: "stop",
	description: "Arrête la musique jouée",
	category: "Musique",
	args: "",
	execute: function (client, message, args) {
		const Utils = require("../utils.js");

		Utils.log(this.name, message);
		if (typeof client.audio !== "undefined" && client.audio !== null) {
			client.queue = [];
			client.audio = null;
			client.connexion.disconnect();
			message.react("🛑");
		}
	}
};