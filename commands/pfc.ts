import {Client, CommandInteraction, CommandInteractionOption} from 'discord.js'
import Utils from '../utils.js'

export const command = {
    name: 'pfc',
    description: 'Lance un pierre-feuille-ciseaux contre Charles-Hubert',
    type: 1,
    options: [
        {
            name: 'choix',
            description: 'votre choix',
            type: 3,
            choices: [
                {
                    name: 'pierre',
                    value: 'pierre'
                },
                {
                    name: 'feuille',
                    value: 'feuille'
                },
                {
                    name: 'ciseaux',
                    value: 'ciseaux'
                }
            ],
            required: true
        }
    ],
    execute: async function (client: Client, interaction: CommandInteraction) {
        Utils.log(this.name, interaction)

        const playerName = (await interaction.guild.members.fetch(interaction.member.user.id)).displayName
        const botName = (await interaction.guild.members.fetch(client.user.id)).displayName
        const choice: string = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === 'choix')
            .value as string
        let botChoice: number | string = Utils.randomInt(1, 3)
        let result: string

        switch (choice) {
            case 'pierre':
                switch (botChoice) {
                    case 1:
                        botChoice = 'pierre'
                        result = 'Egalité'
                        break
                    case 2:
                        botChoice = 'feuille'
                        result = 'Perdu'
                        break
                    case 3:
                        botChoice = 'ciseaux'
                        result = 'Gagné'
                        break
                }
                break
            case 'feuille':
                switch (botChoice) {
                    case 1:
                        botChoice = 'pierre'
                        result = 'Gagné'
                        break
                    case 2:
                        botChoice = 'feuille'
                        result = 'Egalité'
                        break
                    case 3:
                        botChoice = 'ciseaux'
                        result = 'Perdu'
                        break
                }
                break
            case 'ciseaux':
                switch (botChoice) {
                    case 1:
                        botChoice = 'pierre'
                        result = 'Perdu'
                        break
                    case 2:
                        botChoice = 'feuille'
                        result = 'Gagné'
                        break
                    case 3:
                        botChoice = 'ciseaux'
                        result = 'Egalité'
                        break
                }
                break
        }

        interaction.reply(`${result}\n${playerName} : ${choice}\n${botName} : ${botChoice}`)
    }
}
