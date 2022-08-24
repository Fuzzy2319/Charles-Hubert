import {
    Client,
    CommandInteraction,
    CommandInteractionOption,
    PermissionsBitField,
    SlashCommandNumberOption
} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('nettoyer')
    .setDescription('Permet de supprimer un nombre de messages donné. Utilisable seulement par les modérateurs')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
    .addNumberOption(
        (new SlashCommandNumberOption())
            .setName('message')
            .setDescription('nombre de messages à supprimer')
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
        } else {
            await interaction.reply(`${messageNumber} messages supprimés`)
        }
    })

export default command
