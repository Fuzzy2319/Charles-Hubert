import log from './Logger.js'
import * as Fs from 'fs'
import {Locale} from 'discord.js'

class Translator {
    private readonly defaultLocale: Locale

    public constructor() {
        this.defaultLocale = process.env.DEFAULT_LOCALE as Locale
    }

    private getTranslationPath(locale: Locale): string {
        if (Fs.existsSync(`../translation/${locale}.json`)) {
            return `../translation/${locale}.json`
        }
        log.warn(`Missing translation file for locale ${locale} fallback to ${this.defaultLocale}`)

        return `../translation/${this.defaultLocale}.json`
    }

    private applyTranslationParams(translation: string, args: Array<string>): string {
        return translation.replace(/\$(\d+)/g, (match, p1) => args[p1 as number - 1])
    }

    public getTranslation(locale: Locale, key: string, args: Array<string>): string {
        const path: string = this.getTranslationPath(locale)
        const tranlations: object = JSON.parse(Fs.readFileSync(path).toString())
        if (!tranlations.hasOwnProperty(key)) {
            return key
        }

        // @ts-ignore TS7053
        return this.applyTranslationParams(tranlations[key], args)
    }
}

const translator = new Translator()
export default translator
