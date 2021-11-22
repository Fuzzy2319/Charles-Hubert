import { Client, CommandInteraction } from 'discord.js'
import { version } from '../config.js'
import { Utils } from '../utils.js'

export const command = {
    name: 'version',
    description: 'Donne la version actuelle de Charles-Hubert',
    type: 1,
    options: [],
    execute: function (client: Client, interaction: CommandInteraction) {
        Utils.log(this.name, interaction)

        interaction.reply(`Charles-Hubert est actuellement en version : **${version}**`)
    }
}