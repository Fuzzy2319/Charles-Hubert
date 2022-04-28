import {Client, CommandInteraction, CommandInteractionOption, Emoji} from 'discord.js'
import Utils from '../Utils.js'
import {AppCommandOption, AppCommandWithOptions} from '../App'

export default class EmojiCommand implements AppCommandWithOptions {
    public name: string
    public description: string
    public type: 1
    public options: AppCommandOption[]

    constructor() {
        this.name = 'emoji'
        this.description = 'Envoie un emoji animé'
        this.type = 1
        this.options = [
            {
                name: 'emoji',
                description: 'nom de l\'emoji',
                type: 3,
                required: true
            }
        ]
    }

    execute(client: Client, interaction: CommandInteraction) {
        Utils.log(this.name, interaction)

        const emojiName: string = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === 'emoji')
            .value as string

        const emoji: undefined | Emoji = client.emojis.cache.find((emoji: Emoji) => emoji.name === emojiName)

        if (emoji !== undefined) {
            interaction.reply(`${emoji.toString()} ${emoji.toString()} ${emoji.toString()}`)
        } else {
            interaction.reply(`Impossible de trouver l'emoji ${emojiName}`)
        }
    }
}
