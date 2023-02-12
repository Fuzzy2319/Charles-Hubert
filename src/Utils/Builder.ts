import {
    APIApplicationCommandOptionChoice,
    Client,
    CommandInteraction,
    ContextMenuCommandBuilder,
    Locale,
    LocaleString,
    LocalizationMap,
    SlashCommandBuilder,
    SlashCommandNumberOption,
    SlashCommandStringOption
} from 'discord.js'
import {AppCommandBuilder} from '../App.js'
import translator from './Translator.js'

export class AppSlashCommandBuilder extends SlashCommandBuilder implements AppCommandBuilder {
    private callback: (client: Client, interaction: CommandInteraction) => Promise<void>

    public override setName(translationKey: string): this {
        super.setName(translator.getTranslation(translationKey))
        translator.getAvailableLocales().map((locale: Locale) => super.setNameLocalization(locale as LocaleString, translator.getTranslation(translationKey, locale)))

        return this
    }

    public override setDescription(translationKey: string): this {
        super.setDescription(translator.getTranslation(translationKey))
        translator.getAvailableLocales().map((locale: Locale) => super.setDescriptionLocalization(locale as LocaleString, translator.getTranslation(translationKey, locale)))

        return this
    }

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

    public override setName(translationKey: string): this {
        super.setName(translator.getTranslation(translationKey))
        translator.getAvailableLocales().map((locale: Locale) => super.setNameLocalization(locale as LocaleString, translator.getTranslation(translationKey, locale)))

        return this
    }

    public setCallback(callback: (client: Client, interaction: CommandInteraction) => Promise<void>): this {
        this.callback = callback

        return this
    }

    public async execute(client: Client, interaction: CommandInteraction): Promise<void> {
        await this.callback(client, interaction)
    }
}

export class AppSlashCommandNumberOption extends SlashCommandNumberOption {
    public override setName(translationKey: string): this {
        super.setName(translator.getTranslation(translationKey))
        translator.getAvailableLocales().map((locale: Locale) => super.setNameLocalization(locale as LocaleString, translator.getTranslation(translationKey, locale)))

        return this
    }

    public override setDescription(translationKey: string): this {
        super.setDescription(translator.getTranslation(translationKey))
        translator.getAvailableLocales().map((locale: Locale) => super.setDescriptionLocalization(locale as LocaleString, translator.getTranslation(translationKey, locale)))

        return this
    }
}

export class AppSlashCommandStringOption extends SlashCommandStringOption {
    public override setName(translationKey: string): this {
        super.setName(translator.getTranslation(translationKey))
        translator.getAvailableLocales().map((locale: Locale) => super.setNameLocalization(locale as LocaleString, translator.getTranslation(translationKey, locale)))

        return this
    }

    public override setDescription(translationKey: string): this {
        super.setDescription(translator.getTranslation(translationKey))
        translator.getAvailableLocales().map((locale: Locale) => super.setDescriptionLocalization(locale as LocaleString, translator.getTranslation(translationKey, locale)))

        return this
    }
}

export class AppCommandOptionChoice {
    private name: string
    private name_localizations: LocalizationMap | null
    private value: string | number

    public constructor() {
        this.name_localizations = null
    }

    private setNameLocalization(locale: Locale, localizedName: string): this {
        if (this.name_localizations === null) {
            this.name_localizations = {}
        }
        this.name_localizations[locale] = localizedName

        return this
    }

    public setName(translationKey: string): this {
        this.name = translator.getTranslation(translationKey)
        translator.getAvailableLocales().forEach((locale: Locale) => this.setNameLocalization(locale, translator.getTranslation(translationKey, locale)))

        return this
    }

    public setValue(value: string | number): this {
        this.value = value

        return this
    }

    public toJSON(): APIApplicationCommandOptionChoice {
        return {name: this.name, name_localizations: this.name_localizations, value: this.value}
    }
}
