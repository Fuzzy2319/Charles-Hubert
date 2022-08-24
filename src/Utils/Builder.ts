import {Client, CommandInteraction, ContextMenuCommandBuilder, SlashCommandBuilder} from 'discord.js'
import {AppCommandBuilder} from '../App.js'

export class AppSlashCommandBuilder extends SlashCommandBuilder implements AppCommandBuilder {
    private callback: (client: Client, interaction: CommandInteraction) => Promise<void>

    public setCallback(callback: (client: Client, interaction: CommandInteraction) => Promise<void>): this {
        this.callback = callback

        return this
    }

    public async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await this.callback(client, interaction)
    }
}

export class AppContextMenuCommandBuilder extends ContextMenuCommandBuilder implements AppCommandBuilder {
    private callback: (client: Client, interaction: CommandInteraction) => Promise<void>

    public setCallback(callback: (client: Client, interaction: CommandInteraction) => Promise<void>): this {
        this.callback = callback

        return this
    }

    public async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await this.callback(client, interaction)
    }
}
