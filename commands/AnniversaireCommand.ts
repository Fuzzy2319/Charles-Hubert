import {Client, ContextMenuInteraction, GuildMember} from 'discord.js'
import Utils from '../Utils.js'
import {birthdays} from '../birthdays.js'
import {AppContextMenuCommand} from '../App'

export default class AnniversaireCommand implements AppContextMenuCommand {
    public name: string
    public type: 2

    constructor() {
        this.name = 'anniversaire'
        this.type = 2
    }

    async execute(client: Client, interaction: ContextMenuInteraction) {
        Utils.log(this.name, interaction)

        const user: GuildMember = await interaction.guild.members.fetch(interaction.targetId)
        const {1: day, 0: month} = birthdays[user.id].split('-')
        const birthday: Date = new Date(0, Number.parseInt(month) - 1, Number.parseInt(day))

        interaction.reply(
            `${user.displayName} fête son anniversaire le ${
                birthday.toLocaleString(
                    'fr',
                    {
                        day: '2-digit',
                        month: 'long'
                    }
                )
            }`
        )
    }
}
