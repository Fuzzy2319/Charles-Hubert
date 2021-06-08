module.exports = {
    name: "queue",
    description: "Ajoute la musique à la musique en attente ou affiche la musique en attente",
    category: "Musique",
	args: "<url>",
    execute: async function (client, message, args) {
        const Utils = require("../utils.js");
        const Discord = require("discord.js");
        const Ytdl = require("ytdl-core");
        const Ytpl = require("ytpl");

        Utils.log(this.name, message);
        if (args.length > 0) {
            if (typeof client.queue === "undefined") {
                client.queue = [];
            }
            if (message.member.voice.channel !== null) {
                if (Ytdl.validateURL(args[0])) {
                    client.connexion = await message.member.voice.channel.join();
                    Ytdl.getInfo(args[0]).then(info => {
                        client.queue.push(new Utils.Vid(info.player_response.videoDetails.title, args[0], new Utils.Thumb(info.player_response.videoDetails.thumbnail.thumbnails[0].url)));
                        if (typeof client.audio === "undefined" || client.audio === null) {
                            Utils.play(client);
                        }
                        message.react("☑");
                    });
                }
                else {
                    if (Ytpl.validateID(args[0])) {
                        client.connexion = await message.member.voice.channel.join();
                        Ytpl(args[0]).then(playlist => {
                            playlist.items.forEach(item => {
                                if (Ytdl.validateURL(item.shortUrl)) {
                                    client.queue.push(item);
                                }
                                else {
                                    message.channel.send(`Url non valide ${item.shortUrl}`);
                                }
                            });
                        }).then(() => {
                            if (typeof client.audio === "undefined" || client.audio === null) {
                                Utils.play(client);
                            }
                            message.react("☑");
                        });
                    }
                    else {
                        message.channel.send("Url non valide");
                    }
                }
            }
            else {
                message.channel.send("Tu dois être dans un channel vocal pour utiliser cette commande");
            }
        }
        else {
            if (typeof client.queue !== "undefined" && client.queue.length > 1) {
                let msgembed = new Discord.MessageEmbed();
                msgembed
                    .setColor("#007700")
                    .setTitle("Prochaine musique")
                    .setThumbnail(client.queue[1].bestThumbnail.url)
                    .addField(client.queue[1].title, client.queue[1].shortUrl, true);
                message.channel.send(msgembed);
            }
            else {
                message.channel.send("Aucune musique en attente");
            }
        }
    }
};