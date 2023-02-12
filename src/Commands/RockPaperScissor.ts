import {APIApplicationCommandOptionChoice, Client, CommandInteraction, CommandInteractionOption} from 'discord.js'
import {AppSlashCommandBuilder, AppCommandOptionChoice, AppSlashCommandStringOption} from '../Utils/Builder.js'
import randomInt from '../Utils/Random.js'
import translator from '../Utils/Translator.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('command.rock_paper_scissor.name')
    .setDescription('command.rock_paper_scissor.description')
    .setDMPermission(false)
    .addStringOption(
        (new AppSlashCommandStringOption())
            .setName('command.rock_paper_scissor.option.choice.name')
            .setDescription('command.rock_paper_scissor.option.choice.description')
            .setRequired(true)
            .addChoices(
                new AppCommandOptionChoice()
                    .setName('command.rock_paper_scissor.option.choice.rock')
                    .setValue('1')
                    .toJSON() as APIApplicationCommandOptionChoice<string>,
                new AppCommandOptionChoice()
                    .setName('command.rock_paper_scissor.option.choice.paper')
                    .setValue('2')
                    .toJSON() as APIApplicationCommandOptionChoice<string>,
                new AppCommandOptionChoice()
                    .setName('command.rock_paper_scissor.option.choice.scissor')
                    .setValue('3')
                    .toJSON() as APIApplicationCommandOptionChoice<string>
            )
    )
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        const playerName = (await interaction.guild.members.fetch(interaction.user.id)).displayName
        const botName = (await interaction.guild.members.fetch(client.user.id)).displayName
        let choice: string = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === translator.getTranslation('command.rock_paper_scissor.option.choice.name'))
            .value as string
        let botChoice: number | string = randomInt(1, 3)
        let result: string

        switch (choice) {
            case '1':
                choice = 'command.rock_paper_scissor.option.choice.rock'
                switch (botChoice) {
                    case 1:
                        botChoice = 'command.rock_paper_scissor.option.choice.rock'
                        result = 'command.rock_paper_scissor.action.tied'
                        break
                    case 2:
                        botChoice = 'command.rock_paper_scissor.option.choice.paper'
                        result = 'command.rock_paper_scissor.action.lost'
                        break
                    case 3:
                        botChoice = 'command.rock_paper_scissor.option.choice.scissor'
                        result = 'command.rock_paper_scissor.action.won'
                        break
                }
                break
            case '2':
                choice = 'command.rock_paper_scissor.option.choice.paper'
                switch (botChoice) {
                    case 1:
                        botChoice = 'command.rock_paper_scissor.option.choice.rock'
                        result = 'command.rock_paper_scissor.action.won'
                        break
                    case 2:
                        botChoice = 'command.rock_paper_scissor.option.choice.paper'
                        result = 'command.rock_paper_scissor.action.tied'
                        break
                    case 3:
                        botChoice = 'command.rock_paper_scissor.option.choice.scissor'
                        result = 'command.rock_paper_scissor.action.lost'
                        break
                }
                break
            case '3':
                choice = 'command.rock_paper_scissor.option.choice.scissor'
                switch (botChoice) {
                    case 1:
                        botChoice = 'command.rock_paper_scissor.option.choice.rock'
                        result = 'command.rock_paper_scissor.action.lost'
                        break
                    case 2:
                        botChoice = 'command.rock_paper_scissor.option.choice.paper'
                        result = 'command.rock_paper_scissor.action.won'
                        break
                    case 3:
                        botChoice = 'command.rock_paper_scissor.option.choice.scissor'
                        result = 'command.rock_paper_scissor.action.tied'
                        break
                }
                break
        }
        botChoice = translator.getTranslation(botChoice as string, interaction.guild.preferredLocale)
        choice = translator.getTranslation(choice, interaction.guild.preferredLocale)
        result = translator.getTranslation(result, interaction.guild.preferredLocale)

        await interaction.reply(`${result}\n${playerName} : ${choice}\n${botName} : ${botChoice}`)
    })

export default command
