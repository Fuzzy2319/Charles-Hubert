import {
    ActivityType,
    Client,
    Events,
    GatewayIntentBits,
    Guild,
    GuildBasedChannel,
    Interaction,
    Locale,
    PresenceUpdateStatus,
    Routes,
    Snowflake,
    User,
    userMention
} from 'discord.js'
import 'dotenv/config'
import * as Fs from 'fs'
import * as Schedule from 'node-schedule'
import BirthdayProvider from './DataProviders/BirthdayProvider.js'
import { AppContextMenuCommandBuilder, AppSlashCommandBuilder } from './Utils/Builder.js'
import log from './Utils/Logger.js'
import sleep from './Utils/Sleep.js'
import translator from './Utils/Translator.js'

log.debug(translator.getAvailableLocales().toString())

const job: Schedule.Job = Schedule.scheduleJob('0 0 9 * * *', () => {
    client.guilds.cache.map((guild: Guild) => {
        BirthdayProvider.getGuildBirthdays(guild).forEach(async (birthday: Date, userId: Snowflake) => {
            const now: Date = new Date()
            if (`${birthday.getMonth()}-${birthday.getDate()}` === `${now.getMonth()}-${now.getDate()}`) {
                const channel: GuildBasedChannel = await BirthdayProvider.getGuildAnnonceChannel(guild)
                if (channel.isTextBased()) {
                    await channel.sendTyping()
                    await sleep(100)
                    await channel.send(translator.getTranslation('announcement.birthday', guild.preferredLocale, [userMention(userId)]))
                }
            }
        })
    })
})
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
    log.info(translator.getTranslation('commands.add.start'))

    client.guilds.cache.map(async (guild: Guild) => {
        log.debug(translator.getTranslation('commands.add.progress', process.env.DEFAULT_LOCALE as Locale, [guild.name]))
        await client.rest.put(
            Routes.applicationGuildCommands(client.application.id, guild.id),
            {body: commands}
        )
    })

    log.info(translator.getTranslation('commands.add.end'))
}

for (const commandFile of commandFiles) {
    const {default: command} = await import(`./Commands/${commandFile}`)
    commands.push(command)
    log.debug(translator.getTranslation('command.loaded', process.env.DEFAULT_LOCALE as Locale, [command.name]))
}

await client.login(process.env.TOKEN)

client.on(Events.ClientReady, () => {
    log.info(translator.getTranslation('bot.online'))
    registerCommands()
    client.user.setStatus(PresenceUpdateStatus.Online)
    client.user.setActivity('les oiseaux chanter', {type: ActivityType.Listening})
})

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if ((!interaction.isChatInputCommand()) && (!interaction.isContextMenuCommand())) return
    try {
        log.info(translator.getTranslation('command.used', process.env.DEFAULT_LOCALE as Locale, [interaction.user.tag, interaction.commandName]))
        await commands.find(command => command.name === interaction.commandName).execute(client, interaction)
    } catch (error) {
        const user: User = await client.users.fetch(process.env.ADMIN_ID)
        log.error(`${error.name}: ${error.message}`)
        log.trace(error)
        await user.send(translator.getTranslation('command.error', process.env.DEFAULT_LOCALE as Locale, [error.name, error.message]))
    }
})

client.on(Events.ShardDisconnect, async () => {
    job.cancel()
    log.info(translator.getTranslation('commands.delete.start'))
    client.rest.setToken(process.env.TOKEN)
    client.guilds.cache.map(async (guild: Guild) => {
        log.debug(translator.getTranslation('commands.delete.progress', process.env.DEFAULT_LOCALE as Locale, [guild.name]))
        await client.rest.put(
            Routes.applicationGuildCommands(client.application.id, guild.id),
            {body: []}
        )
    })
    log.info(translator.getTranslation('commands.delete.end'))
    // Ugly tmp fix
    await sleep(2_000)
    process.exit()
})
