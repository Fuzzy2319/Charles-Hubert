import { Client, CommandInteraction } from 'discord.js'
import { YouTubeChannel } from 'play-dl'

export interface AppCommandBuilder {
    setCallback(callback: (client: Client, interaction: CommandInteraction) => Promise<void>): this

    execute(client: Client, interaction: CommandInteraction): Promise<void>
}

export interface YoutubeVideoInfo {
    id?: string
    url: string
    title?: string
    description?: string
    durationRaw: string
    durationInSec: number
    uploadedAt?: string
    upcoming?: Date | true
    views: number
    thumbnail?: {
        width: number | undefined
        height: number | undefined
        url: string | undefined
    }
    channel?: YouTubeChannel
    likes: number
    live: boolean
    private: boolean
    tags: string[]
    discretionAdvised?: boolean
    music?: {
        song?: string | {
            text?: string
            url?: string
        }
        artist?: string | {
            text?: string
            url?: string
        }
        album?: string
        writers?: string
        license?: string
    }[];
    chapters: {
        title: string
        timestamp: string
        seconds: number
        thumbnails: {
            width: number | undefined
            height: number | undefined
            url: string | undefined
        }[]
    }[]
}
