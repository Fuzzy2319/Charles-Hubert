module.exports = {
    name: "pfc",
    description: "Lance un pierre-feuille-ciseaux contre Charles-Hubert P pour choisir pierre, F pour choisir feuille et C pour choisir ciseaux",
    category: "Utilisateur",
	args: "<P, F ou C>\\*",
    execute: function (client, message, args) {
        const Utils = require("../utils.js");
        let j1 = null;
        let ordi = null;

        Utils.log(this.name, message);
        if (args.length > 0) {
            if (args[0].toUpperCase() === "P") {
                j1 = "Pierre";
                ordi = Utils.randomInt(1, 3);
                switch (ordi) {
                    case 1:
                        ordi = "Pierre";
                        result = "égalité";
                        break;
                    case 2:
                        ordi = "Feuille";
                        result = "perdu"
                        break;
                    case 3:
                        ordi = "Ciseaux";
                        result = "gagné";
                        break;
                }
            }
            if (args[0].toUpperCase() === "F") {
                j1 = "Feuille";
                ordi = Utils.randomInt(1, 3);
                switch (ordi) {
                    case 1:
                        ordi = "Pierre";
                        result = "gagné";
                        break;
                    case 2:
                        ordi = "Feuille";
                        result = "égalité"
                        break;
                    case 3:
                        ordi = "Ciseaux";
                        result = "perdu";
                        break;
                }
            }
            if (args[0].toUpperCase() === "C") {
                j1 = "Ciseaux";
                ordi = Utils.randomInt(1, 3);
                switch (ordi) {
                    case 1:
                        ordi = "Pierre";
                        result = "perdu";
                        break;
                    case 2:
                        ordi = "Feuille";
                        result = "gagné"
                        break;
                    case 3:
                        ordi = "Ciseaux";
                        result = "égalité";
                        break;
                }
            }
        }
        if (j1 === null) {
            message.channel.send("Erreur de syntaxe: la commande pfc attend un argument qui peut prendre la valeur P, F ou C");
        }
        else {
            message.channel.send(result + "\n" + message.guild.member(message.author.id).displayName + " : " + j1 + "\n" + message.guild.member(client.user.id).displayName + " : " + ordi);
        }
    }
};