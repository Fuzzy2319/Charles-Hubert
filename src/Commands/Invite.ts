import { Client, Collection, CommandInteraction, Invite } from 'discord.js'
import { AppSlashCommandBuilder } from '../Utils/Builder.js'
import translator from '../Utils/Translator.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('command.invite.name')
    .setDescription('command.invite.description')
    .setDMPermission(false)
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        const invites: Collection<string, Invite> = await interaction.guild.invites.fetch()

        if (invites.size === 0) {
            await interaction.reply(
                translator.getTranslation('command.invite.action.error', interaction.guild.preferredLocale, [interaction.guild.name])
            )

            return
        }
        await interaction.reply(translator.getTranslation('command.invite.action.done', interaction.guild.preferredLocale, [invites.first().url]))
    })

export default command
