import {Client, CommandInteraction, CommandInteractionOption, PermissionsBitField} from 'discord.js'
import {AppSlashCommandBuilder, AppSlashCommandNumberOption} from '../Utils/Builder.js'
import translator from '../Utils/Translator.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('command.clean.name')
    .setDescription('command.clean.description')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
    .addNumberOption(
        (new AppSlashCommandNumberOption())
            .setName('command.clean.option.message.name')
            .setDescription('command.clean.option.message.description')
            .setRequired(true)
            .setMinValue(1)
    )
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        const messageNumber: number = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === translator.getTranslation('command.clean.option.message.name'))
            .value as number
        await interaction.channel.bulkDelete(messageNumber)
        if (messageNumber === 1) {
            await interaction.reply({
                content: translator.getTranslation('command.clean.action.done.singular', interaction.guild.preferredLocale, [messageNumber.toString()]),
                ephemeral: true
            })

            return
        }
        await interaction.reply({
            content: translator.getTranslation('command.clean.action.done.plural', interaction.guild.preferredLocale, [messageNumber.toString()]),
            ephemeral: true
        })
    })

export default command
