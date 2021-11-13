import { Utils } from '../utils.js'

export const command = {
	name: 'test',
	description: 'Permet de vérifier si le bot est fonctionnel',
	//category: "Utilisateur"
	//args: ""
	execute: function (client, integration) {
		Utils.log(this.name, integration)
		integration.reply(`Test OK ${client.emojis.resolve("681518586493272088").toString()}`)
	}
}