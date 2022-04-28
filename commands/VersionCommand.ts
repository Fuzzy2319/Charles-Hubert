import {Client, CommandInteraction} from 'discord.js'
import {version} from '../config.js'
import Utils from '../Utils.js'
import {AppCommand} from '../App'

export default class VersionCommand implements AppCommand {
    public name: string
    public description: string
    public type: 1

    constructor() {
        this.name = 'version'
        this.description = 'Donne la version actuelle de Charles-Hubert'
        this.type = 1
    }

    execute(client: Client, interaction: CommandInteraction) {
        Utils.log(this.name, interaction)

        interaction.reply(`Charles-Hubert est actuellement en version : **${version}**`)
    }
}
