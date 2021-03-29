const Fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = Fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require("./commands/" + file);
    client.commands.set(command.name, command);
    console.log("Info: commande " + command.name + " chargée avec succès");
}

client.login(token);

client.on("ready", () => {
    console.log("Connected !");//Signifie que le bot a bien démarré
    client.user.setStatus("online");//Statut du bot
    client.user.setActivity("les oiseaux chanter", { type: "LISTENING" });//Activité du bot
});

client.on("message", message => {
    if (message.channel.type === "dm" && message.author.id !== client.user.id) {
        message.channel.send("Je ne réponds pas aux messages privés");
        return;
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift();

    if (!client.commands.has(command)) return;
    
    try {
        client.commands.get(command).execute(client, message, args);
    } catch (error) {
        client.users.fetch("454682288563683329").then(user => {
            user.send("Une erreur est survenue: " + error.name + ": " + error.message);
        });
    }
});
