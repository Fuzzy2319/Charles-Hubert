import {Client, CommandInteraction, CommandInteractionOption, TextChannel} from 'discord.js'
import Utils from '../utils.js'

export const command = {
    name: 'nettoyer',
    description: 'Permet de vérifier si le bot est fonctionnel',
    type: 1,
    options: [
        {
            name: 'message',
            description: 'nombre de messages à supprimer',
            type: 4,
            required: true
        }
    ],
    execute: function (client: Client, interaction: CommandInteraction) {
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
