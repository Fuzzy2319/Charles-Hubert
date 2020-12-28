const Discord = require("discord.js");
const Fs = require("fs");
const client = new Discord.Client(); //Que votre Bot est un nouvel utilisateur
var msgembed = new Discord.MessageEmbed();
var indexNumber;
var testCommand;
var cleanMsg;
var randomPhrase;
var j1 = null;
var result = null;
var ordi = null;
var invite = null;
var someone = null;
var msgContent = null;
var prefix = "/"; //Préfix des commandes du bot
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function sleep(ms) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < ms);
}
function log(str, message) {
    console.log(prefix + " " + str + " send by " + message.author.username + " on " + message.createdAt);
    try {
        Fs.appendFile("./command.log", prefix + " " + str + " send by " + message.author.username + " on " + message.createdAt + "\n", function (err) {
            if (err) {
                throw err;
            };
        });
    }
    catch (e) {
        console.log(e);
    }
}
client.login("NjMzMzUxOTUxMDg5NjY0MDEw.XaSvHg.LTXzUy6oMqjCTUiBN6CXFRU787Q"); //Token (Série de chiffre) propre a chaque Bot
client.on("ready", () => {
    console.log("Connected !");//Signifie que le bot a bien démarré
    client.user.setStatus("online");//Statut du bot
    client.user.setActivity("les oiseaux chanter", { type: "LISTENING" });//Activité du bot
});
client.on("message", message => {
    if (message.channel.type === "dm" && message.author.id !== client.user.id) {
        message.content = "";
        message.channel.send("je ne réponds pas aux messages privés");
    }
    testCommand = message.content.split(" ");
    if (testCommand[0] === prefix + "test") {
        log("test", message);
        message.channel.send("Test OK " + client.emojis.resolve("681518586493272088").toString());
    }
    if ((testCommand[0] === prefix + "shutdown") && (message.author.id === "454682288563683329") && (message.channel.name === "control-pannel")) {
        log("shutdown", message);
        console.log("Shutingdown Charles-Hubert...");
        message.channel.send("Arrêt de Charles-Hubert").then(message => {
            sleep(500);
            message.edit("Arrêt de Charles-Hubert.").then(message => {
                sleep(1000);
                message.edit("Arrêt de Charles-Hubert..").then(message => {
                    sleep(1000);
                    message.edit("Arrêt de Charles-Hubert...").then(message => {
                        client.destroy();
                    });
                });
            });
        });
    }
    if (testCommand[0] === prefix + "randomMusic") {
        log("randomMusic", message);
        indexNumber = randomInt(0, 338);
        msgembed = new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setThumbnail("https://i.ytimg.com/vi/bKv9WeS8BOs/maxresdefault.jpg")
            .setURL("https://www.youtube.com/embed?listType=playlist&list=PLfrxyCC4yNcJUbgl7cgjGmXNTtwKYj5xm&index=" + indexNumber)
            .addField("YouTube", "https://www.youtube.com/embed?listType=playlist&list=PLfrxyCC4yNcJUbgl7cgjGmXNTtwKYj5xm&index=" + indexNumber);
        message.channel.send("Que pense-tu de cette musique?");
        message.channel.send(msgembed);
    }
    if (testCommand[0] === prefix + "fullPlaylist") {
        log("fullPlaylist", message);
        message.channel.send("Playlist faite par Icecold120000");
        message.channel.send("https://www.youtube.com/playlist?list=PLfrxyCC4yNcJUbgl7cgjGmXNTtwKYj5xm");
    }
    if (testCommand[0] === prefix + "clean") {
        log("clean", message);
        try {
            cleanMsg = parseInt(testCommand[1]) + 1;
            if (cleanMsg > 0) {
                message.channel.bulkDelete(cleanMsg);
                console.log("Cleaned " + cleanMsg + " messages");
            }
            else {
                throw e;
            }
        }
        catch (e) {
            message.channel.send("Erreur de syntaxe: /clean <nombre entier positif non nul>");
            console.log("Cleaned 0 messages");
        }
    }
    if (testCommand[0] === prefix + "version") {
        log("version", message);
        message.channel.send("Charles-Hubert v1.11 by ALEX");
    }
    if (testCommand[0] === prefix + "invite") {
        log("invite", message);
        message.guild.fetchInvites().then(invites => {
            message.channel.send("Utilise cette invitation pour inviter de nouveaux membres \n" + invites.first().url);
        }).catch(error => {
            message.channel.send("Il n'y a pas d'invitation pour ce serveur et/ou la permission gérer le serveur n'est pas activée");
        });
    }
    if (testCommand[0] === prefix + "randomTTS") {
        log("randomTTS", message);
        indexNumber = randomInt(0,10);
        switch (indexNumber){
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
        message.channel.send(randomPhrase, {tts: true});
    }
    if (testCommand[0] === prefix + "help") {
        log("help", message);
        msgembed = new Discord.MessageEmbed()
            .setColor("#007700")
            .setTitle("Menu d'aide")
            .setThumbnail(client.user.avatarURL())
            .addFields(
                { name: message.guild.member(client.user.id).displayName, value: "Le préfixe est actuellement \"" + prefix + "\" utilisez le devant une commande pour effectuer une action.", inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: "Commandes Admin", value: "__**shutdown**__ : arrête le bot pour effectuer une mise à jour du code source utilisable uniquement par Le créateur du bot\n__**prefix**__ <Caractère> : définie un nouveau préfixe utilisable dans #control-pannel par les membres ayant le rôle Grand-fuzzy ou Dieu-fuzzy", inline: true },
                { name: "Commandes Utilisateur", value: "__**test**__ : permet de vérifier si le bot est fonctionnel\n__**randomMusic**__ : donne une musique aléatoire dans la playlist de icecold120000\n__**fullPlaylist**__ : donne la playlist entière de icecold120000\n__**clean**__ <nombre entier positif> : supprime <nombre entier positif>+1 message(s) dans le channel où la commande a été envoyée\n__**version**__ : donne la version actuelle de Charles-Hubert\n__**invite**__ : envoie une invitation pour " + message.guild.name + "\n__**randomTTS**__ : envoie un message tts contenant une phrase rigolote\n__**help**__ : affiche ce message\n__**pfc**__ <P, F ou C>* : lance un pierre-feuille-ciseaux contre Charles-Hubert P pour choisir pierre, F pour choisir feuille et C pour choisir ciseaux\n__**prefix**__ : donne le préfixe actuel\n__**fiesta**__ : envoie l'emoji fiesta\n__**someone**__ <message>* : mentionne une personne aléatoire parmi les membres de la guild avec votre message", inline: true }
            );
        message.channel.send(msgembed);
    }
    if (testCommand[0] === prefix + "pfc") {
        log("pfc", message);
        try {
            if (testCommand[1].toUpperCase() === "P") {
                j1 = "Pierre";
                ordi = randomInt(1, 3);
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
            if (testCommand[1].toUpperCase() === "F") {
                j1 = "Feuille";
                ordi = randomInt(1, 3);
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
            if (testCommand[1].toUpperCase() === "C") {
                j1 = "Ciseaux";
                ordi = randomInt(1, 3);
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
            if (j1 === null) {
                throw (e);
            }
            message.channel.send(result + "\n" + message.guild.member(message.author.id).displayName + " : " + j1 + "\n" + message.guild.member(client.user.id).displayName + " : " + ordi);
            j1 = null;
        }
        catch (e) {
            message.channel.send("Erreur de syntaxe: la commande pfc attend un argument qui peut prendre la valeur P, F ou C");
        }
    }
    if (testCommand[0] === prefix + "prefix") {
        log("prefix", message);
        if (testCommand.length === 2 && testCommand[1] !== "" && message.channel.name === "control-pannel" && (message.guild.member(message.author.id).roles.cache.some(role => role.name === "Grand-fuzzy") || message.guild.member(message.author.id).roles.cache.some(role => role.name === "Dieu-fuzzy"))) {
            if (testCommand[1].slice(0, 1) === testCommand[1]) {
                prefix = testCommand[1];
                message.channel.send("le nouveau préfixe est \"" + prefix + "\"");
            }
            else {
                message.channel.send("L'argument doit être composé d'un seul caractère");
            }
        }
        else {
            message.channel.send("Le préfixe actuel est \"" + prefix + "\"");
        }
    }
    if (testCommand[0] === prefix + "fiesta") {
        log("fiesta", message);
        message.channel.send(client.emojis.resolve("756525370433601587").toString() + client.emojis.resolve("756525370433601587").toString() + client.emojis.resolve("756525370433601587").toString());
    }
    if (testCommand[0] === prefix + "someone") {
        log("someone", message);
        someone = message.guild.members.valueOf().random();
        msgContent = message.content.replace(prefix + "someone", "");
        if (msgContent !== "") {
            message.channel.send(prefix + "clean 1").then(message => {
                message.channel.send("<@" + someone.id + ">" + msgContent);
            });
        }
        else {
            message.channel.send("Erreur de syntaxe: la commande someone attend un argument <message> non null");
        }
    }
});