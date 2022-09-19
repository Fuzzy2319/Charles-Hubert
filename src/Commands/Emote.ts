import {Client, CommandInteraction, CommandInteractionOption, Emoji, Locale, SlashCommandStringOption} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('emote')
    .setNameLocalization(Locale.French, 'emoji')
    .setDescription('Send an emote')
    .setDescriptionLocalization(Locale.French, 'Envoie un emoji')
    .setDMPermission(false)
    .addStringOption(
        (new SlashCommandStringOption())
            .setName('emote')
            .setNameLocalization(Locale.French, 'emoji')
            .setDescription('Emote\'s name')
            .setDescriptionLocalization(Locale.French, 'Nom de l\'emoji')
            .setRequired(true)
    )
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        const emoteName: string = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === 'emote')
            .value as string
        const emote: undefined | Emoji = client.emojis.cache.find(
            (emote: Emoji) => emote.name.toLowerCase() === emoteName.toLowerCase()
        )

        if (emote === undefined) {
            await interaction.reply(`Impossible de trouver l'emoji ${emoteName}`)

            return
        }
        await interaction.reply(`${emote.toString()} ${emote.toString()} ${emote.toString()}`)
    })

export default command
