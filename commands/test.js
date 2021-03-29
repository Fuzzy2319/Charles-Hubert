module.exports = {
	name: 'test',
	description: 'Permet de vérifier si le bot est fonctionnel',
	execute(client, message, args) {
		const Logger = require("../logger.js");
		Logger.log("test", message);
		message.channel.send("Test OK " + client.emojis.resolve("681518586493272088").toString());
	}
};