module.exports = {
    name: "invite",
    description: "Envoie une invitation pour QG d'ALEX",
    category: "Utilisateur",
    execute: function (client, message, args) {
        const Utils = require("../utils.js");

        Utils.log(this.name, message);
        message.guild.fetchInvites().then(invites => {
            message.channel.send("Utilise cette invitation pour inviter de nouveaux membres \n" + invites.first().url);
        }).catch(error => {
            message.channel.send("Il n'y a pas d'invitation pour ce serveur et/ou la permission gérer le serveur n'est pas activée");
        });
    }
}