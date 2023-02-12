import {ApplicationCommandType, Client, ContextMenuCommandInteraction, GuildMember} from 'discord.js'
import {AppContextMenuCommandBuilder} from '../Utils/Builder.js'
import BirthdayProvider from '../DataProviders/BirthdayProvider.js'
import translator from "../Utils/Translator.js";

const command: AppContextMenuCommandBuilder = (new AppContextMenuCommandBuilder())
    .setName('command.birthday.name')
    .setType(ApplicationCommandType.User)
    .setDMPermission(false)
    .setCallback(async (client: Client, interaction: ContextMenuCommandInteraction) => {
        const user: GuildMember = await interaction.guild.members.fetch(interaction.targetId)
        const birthday: Date = BirthdayProvider.getUserBirthday(interaction.guild, user)
        await interaction.reply(
            translator.getTranslation('command.birthday.announcement', interaction.guild.preferredLocale, [
                user.displayName,
                birthday.toLocaleString(interaction.guild.preferredLocale, {day: '2-digit', month: 'long'})
            ])
        )
    })

export default command
