import {Client, CommandInteraction, CommandInteractionOption, TextChannel} from 'discord.js'
import Utils from '../Utils.js'
import {AppCommandOption, AppCommandWithOptions} from '../App'

export default class NettoyerCommand implements AppCommandWithOptions {
    public name: string
    public description: string
    public type: 1
    public options: AppCommandOption[]

    constructor() {
        this.name = 'nettoyer'
        this.description = 'Permet de vérifier si le bot est fonctionnel'
        this.type = 1
        this.options = [
            {
                name: 'message',
                description: 'nombre de messages à supprimer',
                type: 4,
                required: true
            }
        ]
    }

    execute(client: Client, interaction: CommandInteraction) {
        Utils.log(this.name, interaction)

        const messageNumber: number = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === 'message')
            .value as number

        if (messageNumber > 0) {
            (interaction.channel as TextChannel).bulkDelete(messageNumber).then(() => {
                if (messageNumber === 1) {
                    interaction.reply(`${messageNumber} message supprimé`)
                } else {
                    interaction.reply(`${messageNumber} messages supprimés`)
                }
            })
        } else {
            interaction.reply('Erreur : Le nombre de messages doit être un nombre entier non nul')
        }
    }
}
