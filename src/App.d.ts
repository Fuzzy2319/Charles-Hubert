import {Client, CommandInteraction} from 'discord.js'

export interface AppCommandBuilder {
    setCallback(callback: (client: Client, interaction: CommandInteraction) => Promise<void>): this

    execute(client: Client, interaction: CommandInteraction): Promise<void>
}
