import {Client, CommandInteraction, Locale} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('version')
    .setDescription('Output Charles-Hubert\'s version')
    .setDescriptionLocalization(Locale.French, 'Donne la version actuelle de Charles-Hubert')
    .setDMPermission(false)
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        await interaction.reply(
            `Charles-Hubert est actuellement en version : **${process.env.npm_package_version}**`
        )
    })

export default command
