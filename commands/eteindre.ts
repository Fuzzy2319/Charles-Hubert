import {Client, CommandInteraction, Message} from 'discord.js'
import {adminId} from '../config.js'
import Utils from '../utils.js'

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
    execute: async function (client: Client, integration: CommandInteraction) {
        Utils.log(this.name, integration)

        console.log('Arrêt de Charles-Hubert...')

        integration.reply('Arrêt de Charles-Hubert')
        const message: Message = await integration.fetchReply() as Message
        await Utils.sleep(500)
        await message.edit('Arrêt de Charles-Hubert.')
        await Utils.sleep(500)
        await message.edit('Arrêt de Charles-Hubert..')
        await Utils.sleep(500)
        await message.edit('Arrêt de Charles-Hubert...')
        client.destroy()
    }
}
