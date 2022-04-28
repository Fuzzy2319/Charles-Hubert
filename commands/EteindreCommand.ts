import {ApplicationCommandPermissionData, Client, CommandInteraction, Message} from 'discord.js'
import {adminId} from '../config.js'
import Utils from '../Utils.js'
import {AppCommandRestricted} from '../App'

export default class EteindreCommand implements AppCommandRestricted {
    public name: string
    public description: string
    public type: 1
    public permissions: ApplicationCommandPermissionData[]

    constructor() {
        this.name = 'eteindre'
        this.description = 'Arrête le bot. Utilisable uniquement par Le créateur du bot'
        this.type = 1
        this.permissions = [
            {
                id: adminId,
                type: 'USER',
                permission: true
            }
        ]
    }

    async execute(client: Client, integration: CommandInteraction) {
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
