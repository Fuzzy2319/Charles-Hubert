import {
    ApplicationCommandOptionChoice as ApplicationCommandOptionChoiceData,
    ApplicationCommandPermissionData,
    Client,
    Interaction
} from 'discord.js'

export interface AppBaseCommand {
    name: string
    type: 1 | 2 | 3

    execute(client: Client, interaction: Interaction): void
}

export interface AppContextMenuCommand extends AppBaseCommand {
    type: 2 | 3
}

export interface AppCommand extends AppBaseCommand {
    type: 1
    description: string
}

export interface AppCommandWithOptions extends AppCommand {
    options: AppCommandOption[]
}

export interface AppCommandRestricted extends AppCommand {
    permissions: ApplicationCommandPermissionData[]
}

export interface AppCommandOption {
    name: string
    description: string
    type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
    required: boolean
}

export interface AppCommandChoiceOption extends AppCommandOption {
    type: 3
    choices: ApplicationCommandOptionChoiceData[]
}
