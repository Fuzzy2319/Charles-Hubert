import { Client, CommandInteraction, CommandInteractionOption, GuildMember, VoiceChannel } from 'discord.js'
import { Utils } from '../utils.js'
import * as Voice from '@discordjs/voice'
import ytdl from 'ytdl-core'
import play from 'play-dl';
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
                adapterCreator: voiceChan.guild.voiceAdapterCreator as unknown as Voice.DiscordGatewayAdapterCreator
            })
            const audio: Voice.AudioPlayer = Voice.createAudioPlayer({
                behaviors: {
                    noSubscriber: Voice.NoSubscriberBehavior.Play
                }
            })
            const queue: Array<any> = []

            connection.subscribe(audio)

            if (ytdl.validateURL(url)) {
                const music = await play.stream(url)

                queue.push(music)
            } else {
                if (ytpl.validateID(url)) {
                    const playlist = await ytpl(url)

                    await new Promise<void>(resolve => {
                        playlist.items.forEach(async (item: ytpl.Item) => {
                            const music = await play.stream(item.shortUrl)

                            console.log(music)

                            queue.push(music)

                            if (item === playlist.items[playlist.items.length - 1]) {
                                resolve()
                            }
                        })
                    })

                    console.log('ok')
                }
            }

            if (queue.length > 0) {
                Utils.play(audio, queue)
            }
        }
    }
}