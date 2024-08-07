import { Guild, GuildBasedChannel, GuildMember, Snowflake } from 'discord.js'
import Fs from 'fs'

export default class BirthdayProvider {
    private static get dataPath(): string {
        return '../data/birthdays.json'
    }

    static async getGuildAnnonceChannel(guild: Guild): Promise<GuildBasedChannel> | null {
        const data: Map<Snowflake, Map<Snowflake, string>> = BirthdayProvider.unserialize()
        if (data.get(guild.id) === null) {
            return null
        }

        return await guild.channels.fetch(data.get(guild.id).get('_announceChannel'))
    }

    static getGuildBirthdays(guild: Guild): Map<Snowflake, Date> | null {
        const data: Map<Snowflake, Map<Snowflake, string>> = BirthdayProvider.unserialize()
        if (data.get(guild.id) === null) {
            return null
        }

        const birthdays: Map<Snowflake, Date> = new Map<Snowflake, Date>()
        data.get(guild.id).delete('_announceChannel')
        data.get(guild.id).forEach((date, userId) => {
            const {1: day, 0: month} = date.split('-')
            birthdays.set(userId, new Date(0, Number.parseInt(month) - 1, Number.parseInt(day)))
        })

        return birthdays
    }

    static getUserBirthday(guild: Guild, user: GuildMember): Date | null {
        return BirthdayProvider.getGuildBirthdays(guild)?.get(user.id)
    }

    private static unserialize(): Map<Snowflake, Map<Snowflake, string>> {
        const data: Map<Snowflake, Map<Snowflake, string>> = new Map(
            [
                JSON.parse(Fs.readFileSync(BirthdayProvider.dataPath).toString())
            ]
        )
        data.forEach((value, key) => data.set(key, new Map(value)))

        return data
    }
}
