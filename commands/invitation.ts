import {Client, Collection, CommandInteraction, Invite} from 'discord.js'
import Utils from '../utils.js'

export const command = {
    name: 'invitation',
    description: 'Envoie une invitation pour le serveur',
    type: 1,
    options: [],
    execute: function (client: Client, interaction: CommandInteraction) {
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
