import { Client, CommandInteraction, CommandInteractionOption, Emoji } from 'discord.js'
import { Utils } from '../utils.js'

export const command = {
	name: 'emote',
	description: 'Envoie un emoji animé',
	type: 1,
	options: [
		{
			name: 'emoji',
			description: 'nom de l\'emoji',
			type: 3,
			required: true
        }
	],
	execute: function (client: Client, interaction: CommandInteraction) {
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