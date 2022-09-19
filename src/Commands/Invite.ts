import {Client, Collection, CommandInteraction, Invite, Locale} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('invite')
    .setNameLocalization(Locale.French, 'invitation')
    .setDescription('Send an invite for the server')
    .setDescriptionLocalization(Locale.French, 'Envoie une invitation pour le serveur')
    .setDMPermission(false)
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        const invites: Collection<string, Invite> = await interaction.guild.invites.fetch()

        if (invites.size === 0) {
            await interaction.reply(`Il n'y a pas d'invitation pour ${interaction.guild.name}`)

            return
        }
        await interaction.reply(
            `Utilise cette invitation pour inviter de nouveaux membres !!!\n${invites.first().url}`
        )
    })

export default command
