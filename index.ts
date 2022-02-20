import * as Fs from 'fs'
import { ApplicationCommand, Channel, Client, ClientOptions, Collection, Guild, Intents, Interaction, OAuth2Guild, User } from 'discord.js'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import * as Schedule from 'node-schedule'
import { adminId, appId, defaultChanId, qgId, token } from './config.js'
import { birthdays } from './birthdays.js'
import { Utils } from './utils.js'

const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] } as ClientOptions)
const commands = []

let job: Schedule.Job

const commandFiles: string[] = Fs.readdirSync('./commands').filter((file: string) => file.endsWith('.js'))

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

        client.guilds.fetch().then((guilds: Collection<string, OAuth2Guild>) => {
            guilds.forEach(async (guild: OAuth2Guild) => {
                await rest.put(
                    Routes.applicationGuildCommands(appId, guild.id),
                    { body: commands }
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
    client.user.setActivity('les oiseaux chanter', { type: 'LISTENING' })

    job = Schedule.scheduleJob('0 0 9 * * *', () => {
        Object.entries(birthdays).forEach(async (birthday: Array<string>) => {
            const now: Date = new Date()

            if (birthday[1] === `${now.getMonth() + 1}-${now.getDate()}`) {
                const guild: Guild = await client.guilds.fetch(qgId)
                const channel: Channel = await guild.channels.resolve(defaultChanId).fetch()
                if (channel.isText()) {
                    await channel.sendTyping()
                    Utils.sleep(100)
                    channel.send(`Joyeux anniversaire <@${birthday[0]}> !!!`)
                }
            }
        })
    })
})

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand() && !interaction.isContextMenu()) return

    try {
        commands.find(command => command.name === interaction.commandName).execute(client, interaction)
    } catch (error) {
        const user: User = await client.users.fetch(adminId)
        user.send(`Une erreur est survenue: **${error.name}**: ${error.message}`)
    }

    //console.log(interaction);
})

client.on('shardDisconnect', async () => {
    job.cancel()

    console.log('Suppression des commandes (/) en cours')

    client.guilds.cache.forEach(async (guild: Guild) => {
        await rest.put(
            Routes.applicationGuildCommands(appId, guild.id),
            { body: [] }
        )
    })

    console.log('Suppression des commandes (/) terminée')
    process.exit()
})
