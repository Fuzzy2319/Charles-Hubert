import {Client, CommandInteraction, Message} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'
import log from '../Utils/Logger.js'
import sleep from '../Utils/Sleep.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('éteindre')
    .setDescription('Arrête le bot. Utilisable uniquement par Le créateur du bot')
    .setDMPermission(false)
    .setDefaultMemberPermissions(0)
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        log.warn('Arrêt de Charles-Hubert...')

        const message: Message = await interaction.reply({
            fetchReply: true,
            content: 'Arrêt de Charles-Hubert'
        })
        await sleep(500)
        await message.edit('Arrêt de Charles-Hubert.')
        await sleep(500)
        await message.edit('Arrêt de Charles-Hubert..')
        await sleep(500)
        await message.edit('Arrêt de Charles-Hubert...')
        client.destroy()
    })

export default command
