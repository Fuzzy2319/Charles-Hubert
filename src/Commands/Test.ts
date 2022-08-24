import {Client, CommandInteraction} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('test')
    .setDescription('Permet de vérifier si le bot est fonctionnel')
    .setDMPermission(false)
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        await interaction.reply(`Test OK ${client.emojis.resolve('681518586493272088').toString()}`)
    })

export default command
