import { Guild, Snowflake } from 'discord.js'
import Fs from 'fs'
import { YouTubeVideo } from 'play-dl'
import { YoutubeVideoInfo } from '../App.js'
import shuffle from '../Utils/Shuffle.js'

export default class QueueProvider {
    private static get dataPath(): string {
        return '../data/queues.json'
    }

    public static GetGuildQueue(guild: Guild): Array<YoutubeVideoInfo> {
        return QueueProvider.unserialize().get(guild.id) === undefined ? [] : QueueProvider.unserialize().get(guild.id)
    }

    public static SetGuildQueue(guild: Guild, videos: Array<YouTubeVideo | YoutubeVideoInfo>): void {
        const data: Map<Snowflake, Array<YoutubeVideoInfo>> = QueueProvider.unserialize()
        data.set(guild.id, videos)
        QueueProvider.serialize(data)
    }

    public static AddToGuildQueue(guild: Guild, ...videos: Array<YouTubeVideo>): void {
        const queue: Array<YoutubeVideoInfo | YouTubeVideo> = QueueProvider.GetGuildQueue(guild)
        queue.push(...videos)
        QueueProvider.SetGuildQueue(guild, queue)
    }

    public static ClearQueue(guild: Guild): void {
        QueueProvider.SetGuildQueue(guild, [])
    }

    public static ShuffleGuildQueue(guild: Guild): void {
        const queue: Array<YoutubeVideoInfo> = QueueProvider.GetGuildQueue(guild)
        shuffle(queue)
        QueueProvider.SetGuildQueue(guild, queue)
    }

    public static ShiftGuildQueue(guild: Guild): void {
        const queue: Array<YoutubeVideoInfo> = QueueProvider.GetGuildQueue(guild)
        queue.shift()
        QueueProvider.SetGuildQueue(guild, queue)
    }

    private static serialize(data: Map<Snowflake, Array<YoutubeVideoInfo>>): void {
        const buffer: Array<any> = []
        data.forEach((value, key) => {
            buffer.push(key, value)
        })

        Fs.writeFileSync(QueueProvider.dataPath, JSON.stringify(buffer))
    }

    private static unserialize(): Map<Snowflake, Array<YoutubeVideoInfo>> {
        return new Map(
            [
                JSON.parse(
                    Fs.readFileSync(QueueProvider.dataPath).toString() !== '' ?
                        Fs.readFileSync(QueueProvider.dataPath).toString() : '[]'
                )
            ]
        )
    }
}
