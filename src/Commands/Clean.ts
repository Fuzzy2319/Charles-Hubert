import {
    Client,
    CommandInteraction,
    CommandInteractionOption,
    Locale,
    PermissionsBitField,
    SlashCommandNumberOption
} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('clean')
    .setNameLocalization(Locale.French, 'nettoyer')
    .setDescription('Allows you to delete a given number of messages. Can only be used by moderators')
    .setDescriptionLocalization(
        Locale.French,
        'Permet de supprimer un nombre de messages donné. Utilisable seulement par les modérateurs'
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
    .addNumberOption(
        (new SlashCommandNumberOption())
            .setName('message')
            .setDescription('Number of messages to delete')
            .setDescriptionLocalization(Locale.French, 'Nombre de messages à supprimer')
            .setRequired(true)
            .setMinValue(1)
    )
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        const messageNumber: number = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === 'message')
            .value as number
        await interaction.channel.bulkDelete(messageNumber)
        if (messageNumber === 1) {
            await interaction.reply(`${messageNumber} message supprimé`)

            return
        }
        await interaction.reply(`${messageNumber} messages supprimés`)
    })

export default command
