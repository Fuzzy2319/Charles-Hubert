import {Client, CommandInteraction, CommandInteractionOption, SlashCommandStringOption} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'
import randomInt from '../Utils/Random.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('pierre-feuille-ciseaux')
    .setDescription('Lance un pierre-feuille-ciseaux contre Charles-Hubert')
    .setDMPermission(false)
    .addStringOption(
        (new SlashCommandStringOption())
            .setName('choix')
            .setDescription('Votre choix')
            .setRequired(true)
            .addChoices(
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
            )
    )
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        const playerName = (await interaction.guild.members.fetch(interaction.user.id)).displayName
        const botName = (await interaction.guild.members.fetch(client.user.id)).displayName
        const choice: string = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === 'choix')
            .value as string
        let botChoice: number | string = randomInt(1, 3)
        let result: string

        switch (choice) {
            case 'pierre':
                switch (botChoice) {
                    case 1:
                        botChoice = 'pierre'
                        result = 'Égalité'
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
                        result = 'Égalité'
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
                        result = 'Égalité'
                        break
                }
                break
        }

        await interaction.reply(`${result}\n${playerName} : ${choice}\n${botName} : ${botChoice}`)
    })

export default command
