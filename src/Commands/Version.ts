import { Client, CommandInteraction } from 'discord.js'
import { AppSlashCommandBuilder } from '../Utils/Builder.js'
import translator from '../Utils/Translator.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('command.version.name')
    .setDescription('command.version.description')
    .setDMPermission(false)
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        await interaction.reply(translator.getTranslation(
            'command.version.action.done',
            interaction.guild.preferredLocale,
            [process.env.npm_package_version]
        ))
    })

export default command
