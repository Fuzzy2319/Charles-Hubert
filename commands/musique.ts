import { Client, CommandInteraction, CommandInteractionOption, GuildMember, VoiceChannel } from 'discord.js'
import { Utils } from '../utils.js'
import * as Voice from '@discordjs/voice'
import ytdl from 'ytdl-core'
import ytpl from 'ytpl'

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
                adapterCreator: voiceChan.guild.voiceAdapterCreator
            })
            const audio: Voice.AudioPlayer = Voice.createAudioPlayer({
                debug: true,
                behaviors: {
                    maxMissedFrames: 500
                }
            })
            const queue: Array<any> = []

            connection.subscribe(audio)

            if (ytdl.validateURL(url)) {
                const music = ytdl(url, {
                    filter: 'audioonly',
                    quality: 'highestaudio'
                })

                queue.push(music)
            } else {
                if (ytpl.validateID(url)) {
                    const playlist = await ytpl(url)

                    playlist.items.forEach((item: ytpl.Item) => {
                        const music = ytdl(item.shortUrl, {
                            filter: 'audioonly',
                            quality: 'highestaudio'
                        })

                        queue.push(music)
                    })
                }
            }

            if (queue.length > 0) {
                Utils.play(audio, queue)
            }
        }
    }
}