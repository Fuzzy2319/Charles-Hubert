import {Client, CommandInteraction, CommandInteractionOption, Emoji} from 'discord.js'
import {AppSlashCommandBuilder, AppSlashCommandStringOption} from '../Utils/Builder.js'
import translator from '../Utils/Translator.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('command.emote.name')
    .setDescription('command.emote.description')
    .setDMPermission(false)
    .addStringOption(
        (new AppSlashCommandStringOption())
            .setName('command.emote.option.emote.name')
            .setDescription('command.emote.option.emote.description')
            .setRequired(true)
    )
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        const emoteName: string = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === translator.getTranslation('command.emote.option.emote.name'))
            .value as string
        const emote: undefined | Emoji = client.emojis.cache.find(
            (emote: Emoji) => emote.name.toLowerCase() === emoteName.toLowerCase()
        )

        if (emote === undefined) {
            await interaction.reply({
                content: translator.getTranslation('command.emote.action.error', interaction.guild.preferredLocale, [emoteName]),
                ephemeral: true
            })

            return
        }
        await interaction.reply(`${emote.toString()} ${emote.toString()} ${emote.toString()}`)
    })

export default command
