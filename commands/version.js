module.exports = {
    name: "version",
    description: "Donne la version actuelle de Charles-Hubert",
    category: "Utilisateur",
    execute: function (client, message, args) {
        const Utils = require("../utils.js");

        Utils.log(this.name, message);
        message.channel.send("Charles-Hubert v3.0 by ALEX");
    }
}