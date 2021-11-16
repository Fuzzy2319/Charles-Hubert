import { Client, CommandInteraction } from 'discord.js'
import { Utils } from '../utils.js'

export const command = {
	name: 'fiesta',
	description: 'Envoie l\'emoji fiesta',
	//category: "Utilisateur",
	//args: "",
	execute: function (client: Client, interaction: CommandInteraction) {
		Utils.log(this.name, interaction)

		interaction.reply(client.emojis.resolve("756525370433601587").toString() + client.emojis.resolve("756525370433601587").toString() + client.emojis.resolve("756525370433601587").toString())
	}
}