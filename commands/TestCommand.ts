import {Client, CommandInteraction} from 'discord.js'
import Utils from '../Utils.js'
import {AppCommand} from '../App'

export default class TestCommand implements AppCommand {
    public name: string
    public description: string
    public type: 1

    constructor() {
        this.name = 'test'
        this.description = 'Permet de vérifier si le bot est fonctionnel'
        this.type = 1
    }

    execute(client: Client, interaction: CommandInteraction) {
        Utils.log(this.name, interaction)

        interaction.reply(`Test OK ${client.emojis.resolve('681518586493272088').toString()}`)
    }
}
