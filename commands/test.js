module.exports = {
	name: "test",
	description: "Permet de vérifier si le bot est fonctionnel",
	execute: function(client, message, args) {
		const Utils = require("../utils.js");

		Utils.log(this.name, message);
		message.channel.send("Test OK " + client.emojis.resolve("681518586493272088").toString());
	}
};