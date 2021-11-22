import { Client, ContextMenuInteraction, GuildMember } from 'discord.js'
import { Utils } from '../utils.js'
import { birthdays } from '../birthdays.js'

export const command = {
    name: 'birthday',
    //description: 'Affiche la date d\'anniversaire de l\'utilisateur',
    type: 2,
    options: [],
    execute: async function (client: Client, interaction: ContextMenuInteraction) {
        Utils.log(this.name, interaction)

        const user: GuildMember = await interaction.guild.members.fetch(interaction.targetId)
        const { 1: day, 0: month } = birthdays[user.id].split("-")
        const birthday: Date = new Date(0, Number.parseInt(month) - 1, Number.parseInt(day))

        interaction.reply(`${user.displayName} fête son anniversaire le ${birthday.toLocaleString('fr', { day: '2-digit', month: 'long' })}`)
    }
}