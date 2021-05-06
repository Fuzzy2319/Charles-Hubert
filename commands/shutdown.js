module.exports = {
	name: "shutdown",
    description: "Arrête le bot pour effectuer une mise à jour du code source utilisable uniquement par Le créateur du bot",
    category: "Admin",
	args: "",
    execute: function (client, message, args) {
        const Utils = require("../utils.js");

        if ((message.author.id === "454682288563683329") && (message.channel.name === "control-pannel")) {
            Utils.log(this.name, message);
            console.log("Shutingdown Charles-Hubert...");

            client.voice.connections.forEach(connexion => {
                connexion.disconnect();
            });

            message.channel.send("Arrêt de Charles-Hubert").then(message => {
                Utils.sleep(500);
                message.edit("Arrêt de Charles-Hubert.").then(message => {
                    Utils.sleep(1000);
                    message.edit("Arrêt de Charles-Hubert..").then(message => {
                        Utils.sleep(1000);
                        message.edit("Arrêt de Charles-Hubert...").then(message => {
                            client.destroy();
                        });
                    });
                });
            });
        }
	}
};