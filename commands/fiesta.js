module.exports = {
	name: "fiesta",
	description: "Envoie l'emoji fiesta",
	category: "Utilisateur",
	args: "",
	execute: function (client, message, args) {
		const Utils = require("../utils.js");

		Utils.log(this.name, message);
		message.channel.send(client.emojis.resolve("756525370433601587").toString() + client.emojis.resolve("756525370433601587").toString() + client.emojis.resolve("756525370433601587").toString());
	}
}