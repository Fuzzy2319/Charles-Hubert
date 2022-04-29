import * as Fs from 'fs'
import {
    ApplicationCommand,
    Channel,
    Client,
    ClientOptions,
    Collection,
    Guild,
    Intents,
    Interaction,
    OAuth2Guild,
    User
} from 'discord.js'
import {REST} from '@discordjs/rest'
import {Routes} from 'discord-api-types/v9'
import * as Schedule from 'node-schedule'
import {adminId, appId, defaultChanId, qgId, token} from './config.js'
import {birthdays} from './birthdays.js'
import Utils from './Utils.js'
import {AppBaseCommand, AppCommandRestricted} from './App'

const client: Client = new Client(
    {
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_VOICE_STATES
        ]
    } as ClientOptions
)
const commands: AppBaseCommand[] = []

let job: Schedule.Job

const commandFiles: string[] = Fs.readdirSync('./commands').filter((file: string) => file.endsWith('.js'))

for (const file of commandFiles) {
    const {default: command} = await import(`./commands/${file}`)
    commands.push(new command)
    console.info(`Info: commande ${command.name} chargée avec succès`)
}

client.login(token)

const rest: REST = new REST().setToken(token)

const preInit = async () => {
    console.log('Ajout des commandes (/) en cours')

    const guilds: Collection<string, OAuth2Guild> = await client.guilds.fetch()
    guilds.map(async (guild: OAuth2Guild) => {
        await rest.put(
            Routes.applicationGuildCommands(appId, guild.id),
            {body: commands}
        )

        const fullGuild: Guild = await guild.fetch()

        const appCommands: Collection<string, ApplicationCommand> = await fullGuild.commands.fetch()
        commands.map(async (command: AppCommandRestricted) => {
            appCommands.map((appCommand: ApplicationCommand) => {
                if (command.permissions !== undefined && appCommand.name === command.name) {
                    appCommand.setDefaultPermission(false)
                    // command.permissions.push({id: fullGuild.id, type: 'ROLE', permission: false})
                    //
                    // appCommand.permissions.set({permissions: command.permissions})
                }
            })
        })
    })

    console.log('Ajout des commandes (/) terminée')
}

client.on('ready', async () => {
    await preInit()
    console.log('Connecté !')
    client.user.setStatus('online')
    client.user.setActivity('les oiseaux chanter', {type: 'LISTENING'})
    job = Schedule.scheduleJob('0 0 9 * * *', () => {
        Object.entries(birthdays).map(async (birthday: string[]) => {
            const now: Date = new Date()

            if (birthday[1] === `${now.getMonth() + 1}-${now.getDate()}`) {
                const guild: Guild = await client.guilds.fetch(qgId)
                const channel: Channel = await guild.channels.resolve(defaultChanId).fetch()
                if (channel.isText()) {
                    await channel.sendTyping()
                    await Utils.sleep(100)
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
})

client.on('shardDisconnect', async () => {
    job.cancel()
    console.log('Suppression des commandes (/) en cours')
    client.guilds.cache.map(async (guild: Guild) => {
        await rest.put(
            Routes.applicationGuildCommands(appId, guild.id),
            {body: []}
        )
    })
    console.log('Suppression des commandes (/) terminée')

    process.exit()
})
