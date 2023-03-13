import { DiscordGatewayAdapterLibraryMethods } from '@discordjs/voice'
import { Client, CommandInteraction } from 'discord.js'
import { AppSlashCommandBuilder } from '../Utils/Builder.js'
import log from '../Utils/Logger.js'
import sleep from '../Utils/Sleep.js'
import translator from '../Utils/Translator.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('command.shutdown.name')
    .setDescription('command.shutdown.description')
    .setDMPermission(false)
    .setDefaultMemberPermissions(0)
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        log.warn(translator.getTranslation('command.shutdown.action.done'))

        await interaction.reply(translator.getTranslation('command.shutdown.action.start', interaction.guild.preferredLocale))
        await sleep(500)
        await interaction.editReply(translator.getTranslation('command.shutdown.action.progress.1', interaction.guild.preferredLocale))
        await sleep(500)
        client.voice.adapters.forEach((adapter: DiscordGatewayAdapterLibraryMethods) => adapter.destroy())
        await interaction.editReply(translator.getTranslation('command.shutdown.action.progress.2', interaction.guild.preferredLocale))
        await sleep(500)
        await interaction.editReply(translator.getTranslation('command.shutdown.action.done', interaction.guild.preferredLocale))
        client.destroy()
    })

export default command
