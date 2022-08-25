import {Client, CommandInteraction} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('version')
    .setDescription('Donne la version actuelle de Charles-Hubert')
    .setDMPermission(false)
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        await interaction.reply(
            `Charles-Hubert est actuellement en version : **${process.env.npm_package_version}**`
        )
    })

export default command
