module.exports = {
    name: "help",
    description: "Affiche ce message",
    category: "Utilisateur",
	execute: function (client, message, args) {
        const Utils = require("../utils.js");
        const { prefix } = require("../config.json");
        const Discord = require("discord.js");
        let msgembed = new Discord.MessageEmbed();
        let descriptionCommands = [];

		Utils.log(this.name, message);
        msgembed.setColor("#007700")
        .setTitle("Menu d'aide")
        .setThumbnail(client.user.avatarURL())
        .addFields(
            { name: message.guild.member(client.user.id).displayName, value: "Le préfixe est actuellement \"" + prefix + "\" utilisez le devant une commande pour effectuer une action.", inline: true },
            { name: "\u200B", value: "\u200B" },
        );

        if (args.length === 0) {
            client.commands.forEach(command => {
                if (typeof descriptionCommands[command.category] === "undefined") {
                    descriptionCommands[command.category] = "";
                }
                descriptionCommands[command.category] += "__**" + command.name + "**__: " + command.description + "\n";
            });
        }
        else {
            client.commands.filter(command => command.category === args[0]).forEach(command => {
                if (typeof descriptionCommands[command.category] === "undefined") {
                    descriptionCommands[command.category] = "";
                }
                descriptionCommands[command.category] += "__**" + command.name + "**__: " + command.description + "\n";
            });
        }

        for (const [key, value] of Object.entries(descriptionCommands)) {
            msgembed.addField("Commandes " + key, value, true);
        }
        
        message.channel.send(msgembed);
	}
};