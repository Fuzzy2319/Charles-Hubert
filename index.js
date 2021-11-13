import * as Fs from 'fs';
import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as Schedule from 'node-schedule';
import { token } from './config.js';
import { birthdays } from './birthdays.js';
import { Utils } from './utils.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const commands = [];
const commandFiles = Fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const { command } = await import(`./commands/${file}`);
    commands.push(command);
    console.info(`Info: commande ${command.name} chargée avec succès`);
}
client.login(token);
const rest = new REST({ version: '9' }).setToken(token);
const preInit = async () => {
    try {
        console.log('Mise à jour des commandes (/) en cours');
        const body = [];
        commands.forEach(command => {
            body.push({ name: command.name, description: command.description });
        });
        await rest.put(Routes.applicationGuildCommands('633351951089664010', '454688325651922944'), { body });
        console.log('Mise à jour des commandes (/) terminée');
    }
    catch (e) {
        console.error(e);
    }
};
client.on('ready', async () => {
    await preInit();
    console.log('Connected !');
    client.user.setStatus('online');
    client.user.setActivity('les oiseaux chanter', { type: "LISTENING" });
    Schedule.scheduleJob('0 0 9 * * *', () => {
        Object.entries(birthdays).forEach(birthday => {
            const now = new Date();
            if (birthday[1] === `${now.getMonth() + 1}-${now.getDate()}`) {
                client.guilds.fetch('454688325651922944').then(guild => {
                    guild.channels.resolve('454688325651922946').fetch().then((channel) => {
                        if (channel.isText()) {
                            channel.sendTyping().then(() => {
                                Utils.sleep(100);
                                channel.send(`Joyeux anniversaire <@${birthday[0]}> !!!`);
                            });
                        }
                    });
                });
            }
        });
    });
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    try {
        commands.find(command => command.name === interaction.commandName).execute(client, interaction);
    }
    catch (error) {
        client.users.fetch('454682288563683329').then(user => {
            user.send(`Une erreur est survenue: **${error.name}**: ${error.message}`);
        });
    }
});
