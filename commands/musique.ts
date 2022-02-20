import { Client, CommandInteraction, CommandInteractionOption, GuildMember, VoiceChannel } from 'discord.js'
import { Utils } from '../utils.js'
import * as Voice from '@discordjs/voice'
import play, { YouTubeStream } from 'play-dl'

export const command = {
    name: 'musique',
    description: 'Joue une musique dans un channel vocal',
    type: 1,
    options: [
        {
            name: 'url',
            description: 'Lien de la musique à jouer',
            type: 3,
            required: true
        }
    ],
    execute: async function (client: Client, interaction: CommandInteraction) {
        Utils.log(this.name, interaction)

        const voiceChan: VoiceChannel = (interaction.member as GuildMember)?.voice.channel as VoiceChannel

        if (voiceChan === undefined) {
            interaction.reply('Vous devez être connecté à un channel vocal pour utiliser la commande')
        } else {
            const url: string = interaction
                .options
                .data
                .find((option: CommandInteractionOption) => option.name === 'url')
                .value as string
            const connection = Voice.joinVoiceChannel({
                channelId: voiceChan.id,
                guildId: voiceChan.guild.id,
                adapterCreator: voiceChan.guild.voiceAdapterCreator as unknown as Voice.DiscordGatewayAdapterCreator
            })
            const audio: Voice.AudioPlayer = Voice.createAudioPlayer({
                behaviors: {
                    noSubscriber: Voice.NoSubscriberBehavior.Play
                }
            })
            const queue: Array<YouTubeStream> = []

            connection.subscribe(audio)

            if (url.startsWith('http') && play.yt_validate(url) === 'video') {
                const music = await play.stream(url, { quality: 2 })

                queue.push(music as YouTubeStream)
            } else {
                if (play.yt_validate(url) === 'playlist') {
                    const playlist = await (await play.playlist_info(url, { incomplete: true })).all_videos()

                    await new Promise<void>(resolve => {
                        playlist.forEach(async (item) => {
                            const music = await play.stream(item.url, { quality: 2 })

                            queue.push(music as YouTubeStream)

                            if (item === playlist[playlist.length - 1]) {
                                resolve()
                            }
                        })
                    })
                }
            }

            if (queue.length > 0) {
                Utils.play(audio, queue)
            }
        }
    }
}