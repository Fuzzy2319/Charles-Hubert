module.exports = {
	name: "play",
    description: "Joue une musique dans un channel vocal",
    category: "Musique",
	args: "<url>\\*",
	execute: async function (client, message, args) {
        const Utils = require("../utils.js");
        const Ytdl = require("ytdl-core");
        const Ytpl = require("ytpl");

		Utils.log(this.name, message);
        if (args.length > 0) {
            if (message.member.voice.channel !== null) {
                if (Ytdl.validateURL(args[0])) {
                    client.connexion = await message.member.voice.channel.join();
                    Ytdl.getInfo(args[0]).then(info => {
                        client.queue = [];
                        client.queue.push(new Utils.Vid(info.player_response.videoDetails.title, args[0], new Utils.Thumb(info.player_response.videoDetails.thumbnail.thumbnails[0].url)));
                        Utils.play(client);
                        message.react("▶");
                    });
                }
                else {
                    if (Ytpl.validateID(args[0])) {
                        client.connexion = await message.member.voice.channel.join();
                        client.queue = [];
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
                            Utils.play(client);
                            message.react("▶");
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
            message.channel.send("Erreur de syntaxe: la commande play attend un argument <url> non null");
        }
	}
};