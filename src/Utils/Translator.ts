import { Locale } from 'discord.js'
import Fs from 'fs'
import log from './Logger.js'

class Translator {
    private readonly defaultLocale: Locale

    public constructor() {
        this.defaultLocale = process.env.DEFAULT_LOCALE as Locale
        log.debug(this.defaultLocale)
    }

    public getTranslation(key: string, locale: Locale = this.defaultLocale, args: Array<string> = []): string {
        const path: string = this.getTranslationPath(locale)
        const tranlations: object = JSON.parse(Fs.readFileSync(path).toString())
        if (!tranlations.hasOwnProperty(key)) {
            if (locale !== this.defaultLocale) {
                log.warn(`Missing translation key ${key} for locale ${locale} fallback to ${this.defaultLocale}`)

                return this.getTranslation(key, this.defaultLocale, args)
            }
            log.error(`Missing translation key ${key} for default locale ${locale}`)

            return key
        }

        // @ts-ignore TS7053
        return this.applyTranslationParams(tranlations[key], args)
    }

    public getAvailableLocales(): Array<Locale> {
        const translationFiles: Array<string> = Fs.readdirSync('../translation/').filter((file: string) => file.endsWith('.json'))

        return translationFiles.map<Locale>((translationFile: string) => translationFile.replace('.json', '') as Locale)
    }

    private getTranslationPath(locale: Locale): string {
        if (Fs.existsSync(`../translation/${locale}.json`)) {
            return `../translation/${locale}.json`
        }
        log.warn(`Missing translation file for locale ${locale} fallback to ${this.defaultLocale}`)

        return `../translation/${this.defaultLocale}.json`
    }

    private applyTranslationParams(translation: string, args: Array<string>): string {
        return translation.replace(/\$(\d+)/g, (match: string, index: number) => args[index - 1] ?? match)
    }
}

const translator = new Translator()
export default translator
