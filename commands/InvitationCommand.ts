import {Client, Collection, CommandInteraction, Invite} from 'discord.js'
import Utils from '../Utils.js'
import {AppCommand} from '../App'

export default class InvitationCommand implements AppCommand {
    public name: string
    public description: string
    public type: 1

    constructor() {
        this.name = 'invitation'
        this.description = 'Envoie une invitation pour le serveur'
        this.type = 1
    }

    execute(client: Client, interaction: CommandInteraction) {
        Utils.log(this.name, interaction)

        interaction.guild.invites.fetch().then((invites: Collection<string, Invite>) => {
            if (invites.size === 0) {
                interaction.reply(`Il n'y a pas d'invitation pour ${interaction.guild.name}`)
            } else {
                interaction.reply(
                    `Utilise cette invitation pour inviter de nouveaux membres!!\n${invites.first().url}`
                )
            }
        })
    }
}
