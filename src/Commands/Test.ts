import {Client, CommandInteraction} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'
import translator from '../Utils/Translator.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('command.test.name')
    .setDescription('command.test.description')
    .setDMPermission(false)
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        await interaction.reply(translator.getTranslation(
            'command.test.action.done',
            interaction.guild.preferredLocale,
            [client.emojis.resolve('681518586493272088').toString()]
        ))
    })

export default command
