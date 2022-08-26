import * as Fs from 'fs'
import {Snowflake} from 'discord-api-types/globals'
import {YouTubeVideo} from 'play-dl'
import {Guild} from 'discord.js'
import shuffle from '../Utils/Shuffle.js'

export default class QueueProvider {
    private static get dataPath(): string {
        return '../data/queues.json'
    }

    private static serialize(data: Map<Snowflake, Array<YouTubeVideo>>): void {
        const buffer: Array<any> = []
        data.forEach((value, key) => {
            buffer.push(key, value)
        })

        Fs.writeFileSync(QueueProvider.dataPath, JSON.stringify(buffer))
    }

    private static unserialize(): Map<Snowflake, Array<YouTubeVideo>> {
        return new Map(
            [
                JSON.parse(
                    Fs.readFileSync(QueueProvider.dataPath).toString() !== '' ?
                        Fs.readFileSync(QueueProvider.dataPath).toString() : '[]'
                )
            ]
        )
    }

    public static GetGuildQueue(guild: Guild): Array<YouTubeVideo> {
        return QueueProvider.unserialize().get(guild.id) === undefined ? [] : QueueProvider.unserialize().get(guild.id)
    }

    public static SetGuildQueue(guild: Guild, videos: Array<YouTubeVideo>): void {
        const data: Map<Snowflake, Array<YouTubeVideo>> = QueueProvider.unserialize()
        data.set(guild.id, videos)
        QueueProvider.serialize(data)
    }

    public static AddToGuildQueue(guild: Guild, ...videos: Array<YouTubeVideo>): void {
        const queue: Array<YouTubeVideo> = QueueProvider.GetGuildQueue(guild)
        queue.push(...videos)
        QueueProvider.SetGuildQueue(guild, queue)
    }

    public static ClearQueue(guild: Guild): void {
        QueueProvider.SetGuildQueue(guild, [])
    }

    public static ShuffleGuildQueue(guild: Guild): void {
        const queue: Array<YouTubeVideo> = QueueProvider.GetGuildQueue(guild)
        shuffle(queue)
        QueueProvider.SetGuildQueue(guild, queue)
    }

    public static ShiftGuildQueue(guild: Guild): void {
        const queue: Array<YouTubeVideo> = QueueProvider.GetGuildQueue(guild)
        queue.shift()
        QueueProvider.SetGuildQueue(guild, queue)
    }
}
