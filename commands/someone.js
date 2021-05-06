module.exports = {
    name: "someone",
    description: "Mentionne une personne aléatoire parmi les membres de la guild avec votre message",
    category: "Utilisateur",
	args: "<message>\\*",
	execute: function (client, message, args) {
        const Utils = require("../utils.js");

		Utils.log(this.name, message);
        message.guild.members.fetch().then(members => {
            let someone = members.random();
            let msgContent = args.join(" ");

            if (msgContent !== "") {
                message.delete();
                message.channel.send("<@" + someone.id + "> " + msgContent);
            }
            else {
                message.channel.send("Erreur de syntaxe: la commande someone attend un argument <message> non null");
            }
        });
    }
}