import {ApplicationCommandType, Client, ContextMenuCommandInteraction, GuildMember, Locale} from 'discord.js'
import {AppContextMenuCommandBuilder} from '../Utils/Builder.js'
import BirthdayProvider from '../DataProviders/BirthdayProvider.js'

const command: AppContextMenuCommandBuilder = (new AppContextMenuCommandBuilder())
    .setName('birthday')
    .setNameLocalization(Locale.French, 'anniversaire')
    .setType(ApplicationCommandType.User)
    .setDMPermission(false)
    .setCallback(async (client: Client, interaction: ContextMenuCommandInteraction) => {
        const user: GuildMember = await interaction.guild.members.fetch(interaction.targetId)
        const birthday: Date = BirthdayProvider.getUserBirthday(interaction.guild, user)
        await interaction.reply(
            `${user.displayName} fête son anniversaire le ${birthday.toLocaleString('fr', {
                day: '2-digit',
                month: 'long'
            })}`
        )
    })

export default command
