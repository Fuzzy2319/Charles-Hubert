import {Client, CommandInteraction, Locale, Message} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'
import log from '../Utils/Logger.js'
import sleep from '../Utils/Sleep.js'
import {DiscordGatewayAdapterLibraryMethods} from "@discordjs/voice";

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('shutdown')
    .setNameLocalization(Locale.French, 'éteindre')
    .setDescription('Shutdown bot')
    .setDescriptionLocalization(Locale.French, 'Arrête le bot')
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
        client.voice.adapters.forEach((adapter: DiscordGatewayAdapterLibraryMethods) => adapter.destroy())
        await message.edit('Arrêt de Charles-Hubert..')
        await sleep(500)
        await message.edit('Arrêt de Charles-Hubert...')
        client.destroy()
    })

export default command
