import 'dotenv/config'
import {ActivityType, Client, GatewayIntentBits, Guild, GuildChannel, Interaction, Routes, User} from 'discord.js'
import log from './Utils/Logger.js'
import * as Fs from 'fs'
import {AppContextMenuCommandBuilder, AppSlashCommandBuilder} from './Utils/Builder.js'
import * as Schedule from 'node-schedule'
import BirthdayProvider from './DataProviders/BirthdayProvider.js'
import {Snowflake} from 'discord-api-types/globals'
import sleep from './Utils/Sleep.js'

let job: Schedule.Job
const client: Client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates
        ]
    }
)
const commandFiles: string[] = Fs.readdirSync('./Commands/').filter((file: string) => file.endsWith('.js'))
const commands: Array<AppSlashCommandBuilder | AppContextMenuCommandBuilder> = []
const registerCommands = () => {
    log.info('Ajout des commandes (/) en cours')

    client.guilds.cache.map(async (guild: Guild) => {
        log.debug(`Ajout des commandes (/) sur la guild: ${guild.name}`)
        await client.rest.put(
            Routes.applicationGuildCommands(client.application.id, guild.id),
            {body: commands}
        )
    })

    log.info('Ajout des commandes (/) terminée')
}

for (const commandFile of commandFiles) {
    const {default: command} = await import(`./Commands/${commandFile}`)
    log.debug(command)
    commands.push(command)
    log.debug(`Commande ${command.name} chargée avec succès`)
}

await client.login(process.env.TOKEN)

client.on('ready', () => {
    log.info('Connecté !')
    registerCommands()
    client.user.setStatus('online')
    client.user.setActivity('les oiseaux chanter', {type: ActivityType.Listening})
    job = Schedule.scheduleJob('0 0 9 * * *', () => {
        client.guilds.cache.map((guild: Guild) => {
            BirthdayProvider.getGuildBirthdays(guild).forEach(async (birthday: Date, userId: Snowflake) => {
                const now: Date = new Date()
                if (`${birthday.getMonth()}-${birthday.getDate()}` === `${now.getMonth()}-${now.getDate()}`) {
                    const channel: GuildChannel = await BirthdayProvider.getGuildAnnonceChannel(guild)
                    if (channel.isTextBased()) {
                        await channel.sendTyping()
                        await sleep(100)
                        await channel.send(`Joyeux anniversaire <@${userId}> !!!`)
                    }
                }
            })
        })
    })
})

client.on('interactionCreate', async (interaction: Interaction) => {
    if ((!interaction.isChatInputCommand()) && (!interaction.isContextMenuCommand())) return
    try {
        log.info(`${interaction.user.tag} a utilisé la commande ${interaction.commandName}`)
        await commands.find(command => command.name === interaction.commandName).execute(client, interaction)
    } catch (error) {
        const user: User = await client.users.fetch(process.env.ADMIN_ID)
        log.error(`${error.name}: ${error.message}`)
        await user.send(`Une erreur est survenue: **${error.name}**: ${error.message}`)
    }
})

client.on('shardDisconnect', () => {
    job.cancel()
    log.info('Suppression des commandes (/) en cours')
    client.guilds.cache.map(async (guild: Guild) => {
        log.debug(`Suppression des commandes (/) sur la guild: ${guild.name}`)
        await client.rest.setToken(process.env.TOKEN).put(
            Routes.applicationGuildCommands(client.application.id, guild.id),
            {body: []}
        )
    })
    log.info('Suppression des commandes (/) terminée')
})
