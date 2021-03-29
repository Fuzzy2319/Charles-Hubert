module.exports = {
    name: "prefix",
    description: "Donne le préfixe actuel",
    category: "Utilisateur",
    execute: function (client, message, args) {
        const Utils = require("../utils.js");
        const { prefix } = require("../config.json");

        Utils.log(this.name, message);
        message.channel.send("Le préfixe actuel est \"" + prefix + "\"");
    }
};