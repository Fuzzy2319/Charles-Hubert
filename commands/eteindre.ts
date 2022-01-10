import { Client, CommandInteraction, Message } from 'discord.js'
import { adminId } from '../config.js'
import { Utils } from '../utils.js'

export const command = {
    name: 'eteindre',
    description: 'Arrête le bot. Utilisable uniquement par Le créateur du bot',
    type: 1,
    options: [],
    permissions: [
        { 
            id: adminId,
            type: 'USER',
            permission: true
        }
    ],
    execute: function (client: Client, integration: CommandInteraction) {
        Utils.log(this.name, integration)

        console.log('Arrêt de Charles-Hubert...')

        integration.reply('Arrêt de Charles-Hubert')
        integration.fetchReply().then((message: Message) => {
            Utils.sleep(500)
            message.edit('Arrêt de Charles-Hubert.').then((message: Message) => {
                Utils.sleep(1000)
                message.edit('Arrêt de Charles-Hubert..').then((message: Message) => {
                    Utils.sleep(1000)
                    message.edit('Arrêt de Charles-Hubert...').then(() => {
                        client.destroy()
                    })
                })
            })
        })
    }
}