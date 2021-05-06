module.exports = {
    name: "current",
    description: "Affiche la musique en jouée",
    category: "Musique",
    args: "",
    execute: async function (client, message, args) {
        const Utils = require("../utils.js");
        const Discord = require("discord.js");

        Utils.log(this.name, message);
        if (typeof client.queue !== "undefined" && client.queue.length > 0) {
            let msgembed = new Discord.MessageEmbed();
            msgembed
                .setColor("#007700")
                .setTitle("Prochaine musique")
                .setThumbnail(client.queue[0].bestThumbnail.url)
                .addField(client.queue[0].title, client.queue[0].shortUrl, true);
            message.channel.send(msgembed);
        }
        else {
            message.channel.send("Aucune musique en jouée");
        }
    }
};