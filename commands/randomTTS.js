module.exports = {
    name: "randomTTS",
    description: "Envoie un message tts contenant une phrase rigolote",
    category: "Utilisateur",
    execute: function (client, message, args) {
        const Utils = require("../utils.js");

        Utils.log(this.name, message);
        let indexNumber = Utils.randomInt(0, 10);
        switch (indexNumber) {
            case 0:
                randomPhrase = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
                break;
            case 1:
                randomPhrase = "Voici la nouvelle pham de ta vie";
                break;
            case 2:
                randomPhrase = message.guild.members.find(user => user.id === message.author.id).displayName + " coucou petite bite";
                break;
            case 3:
                randomPhrase = "nope";
                break;
            case 4:
                randomPhrase = "...";
                break;
            case 5:
                randomPhrase = "42";
                break;
            case 6:
                randomPhrase = "dedeededeedededeeedeeeddededeeededededeeeededdedededdee";
                break;
            case 7:
                randomPhrase = "/randomTTS";
                break;
            case 8:
                randomPhrase = "namenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamename";
                break;
            case 9:
                randomPhrase = "lolololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololol";
                break;
            case 10:
                randomPhrase = "ioioiioiooioiiooiioioioioiooiioioiiioioioiooioioiioiooioiioioiooiiooioiioioioiooioioiiooioiiioioioiioiooioiiooiioioioioiooiioioiiioioioiooioioiioiooioiioioiooiiooio";
                break;
        }
        message.channel.send(randomPhrase, { tts: true });
    }
}