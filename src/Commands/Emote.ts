import {Client, CommandInteraction, CommandInteractionOption, Emoji, SlashCommandStringOption} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('emoji')
    .setDescription('Envoie un emoji')
    .setDMPermission(false)
    .addStringOption(
        (new SlashCommandStringOption())
            .setName('emoji')
            .setDescription('Nom de l\'emoji')
            .setRequired(true)
    )
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        const emojiName: string = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === 'emoji')
            .value as string
        const emoji: undefined | Emoji = client.emojis.cache.find(
            (emoji: Emoji) => emoji.name.toLowerCase() === emojiName.toLowerCase()
        )

        if (emoji === undefined) {
            await interaction.reply(`Impossible de trouver l'emoji ${emojiName}`)

            return
        }
        await interaction.reply(`${emoji.toString()} ${emoji.toString()} ${emoji.toString()}`)
    })

export default command
