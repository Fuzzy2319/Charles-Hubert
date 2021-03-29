module.exports = {
    name: "clean",
    description: "Supprime <nombre entier positif>+1 message(s) dans le channel où la commande a été envoyée",
    execute: function(client, message, args) {
        const Utils = require("../utils.js");

        Utils.log(this.name, message);
        let cleanMsg = parseInt(args[0]) + 1;

        if (cleanMsg > 0) {
                message.channel.bulkDelete(cleanMsg).then(() => {
                    console.log("Cleaned " + cleanMsg + " messages");
                }).catch(() => {
                    if (cleanMsg === 1) {
                        message.channel.send("Impossible de supprimer le message");
                    }
                    else {
                        message.channel.send("Impossible de supprimer les " + cleanMsg + " messages");
                    }
                });
        }
        else {
            message.channel.send("Erreur de syntaxe: /clean <nombre entier positif non nul>");
            console.log("Cleaned 0 messages");
        }
    }
}