import * as Fs from 'fs'
import { ApplicationCommand, Channel, Client, ClientOptions, Collection, Guild, Intents, OAuth2Guild} from 'discord.js'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import * as Schedule from 'node-schedule'
import { token } from './config.js'
import { birthdays } from './birthdays.js'
import { Utils } from './utils.js'

const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS] } as ClientOptions)
const commands = []

let job: Schedule.Job

const commandFiles: string[] = Fs.readdirSync("./commands").filter((file: string) => file.endsWith(".js"))

for (const file of commandFiles) {
    const { command } = await import(`./commands/${file}`)
    //client.commands.set(command.name, command);
    commands.push(command)
    console.info(`Info: commande ${command.name} chargée avec succès`)
}

client.login(token)

const rest: REST = new REST({ version: '9' }).setToken(token)

const preInit = async () => {
    try {
        console.log('Ajout des commandes (/) en cours')
        const body = []

        commands.forEach(command => {
            body.push(
                {
                    name: command.name,
                    description: command.description,
                    type: command.type,
                    options: command.options
                }
            )            
        })

        client.guilds.fetch().then((guilds: Collection<string, OAuth2Guild>) => {
            guilds.forEach(async (guild: OAuth2Guild) => {
                await rest.put(
                    Routes.applicationGuildCommands('633351951089664010', guild.id),
                    { body }
                )

                const fullGuild: Guild = await guild.fetch()

                commands.forEach(async command => {
                    const appCommands: Collection<string, ApplicationCommand> = await fullGuild.commands.fetch()
                    appCommands.forEach((appCommand: ApplicationCommand) => {
                        if (command?.permissions !== undefined && appCommand.name === command.name) {
                            command.permissions.push({ id: fullGuild.id, type: 'ROLE', permission: false })

                            appCommand.permissions.set({permissions: command.permissions })
                        }
                        //console.log(appCommand)
                    })
                })
            })
        })

        console.log('Ajout des commandes (/) terminée')
    } catch (e) {
        console.error(e)
    }
}


client.on('ready', async () => {
    await preInit()

    console.log('Connecté !')
    client.user.setStatus('online')
    client.user.setActivity('les oiseaux chanter', { type: "LISTENING" })

    job = Schedule.scheduleJob('0 0 9 * * *', () => {
        Object.entries(birthdays).forEach(birthday => {
            const now: Date = new Date()

            if (birthday[1] === `${now.getMonth() + 1}-${now.getDate()}`) {
                client.guilds.fetch('454688325651922944').then(guild => {
                    guild.channels.resolve('454688325651922946').fetch().then((channel: Channel) => {
                        if (channel.isText()) {
                            channel.sendTyping().then(() => {
                                Utils.sleep(100)
                                channel.send(`Joyeux anniversaire <@${birthday[0]}> !!!`)
                            })
                        }
                    })
                })
            }
        })
    })
})

/*client.on("message", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.channel.type === "dm" && message.author.id !== client.user.id) {
        message.channel.send("Je ne réponds pas aux messages privés");
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift();

    if (!client.commands.has(command)) return;
    
    try {
        client.commands.get(command).execute(client, message, args);
    } catch (error) {
        client.users.fetch("454682288563683329").then(user => {
            user.send(`Une erreur est survenue: **${error.name}**: ${error.message}`);
        });
    }
});*/

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    try {
        commands.find(command => command.name === interaction.commandName).execute(client, interaction)
    } catch (error) {
        client.users.fetch('454682288563683329').then(user => {
            user.send(`Une erreur est survenue: **${error.name}**: ${error.message}`)
        })
    }

    //console.log(interaction);
})

client.on('shardDisconnect', async () => {
    job.cancel()
    console.log('Suppression des commandes (/) en cours')
    await rest.put(
        Routes.applicationGuildCommands('633351951089664010', '454688325651922944'),
        { body: [] }
    )
    console.log('Suppression des commandes (/) terminée')
})
