import {Client, CommandInteraction} from 'discord.js'
import Utils from '../utils.js'

export const command = {
    name: 'test',
    description: 'Permet de vérifier si le bot est fonctionnel',
    type: 1,
    options: [],
    execute: function (client: Client, interaction: CommandInteraction) {
        Utils.log(this.name, interaction)

        interaction.reply(`Test OK ${client.emojis.resolve('681518586493272088').toString()}`)
    }
}
