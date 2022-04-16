import {
    Client,
    CommandInteraction,
    CommandInteractionOption,
    GuildMember,
    InteractionCollector,
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
    VoiceChannel
} from 'discord.js'
import Utils from '../utils.js'
import * as Voice from '@discordjs/voice'
import {AudioPlayerStatus} from '@discordjs/voice'
import play, {YouTubeStream, YouTubeVideo} from 'play-dl'

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

        await interaction.deferReply()

        const voiceChan: VoiceChannel = (interaction.member as GuildMember)?.voice.channel as VoiceChannel

        if (voiceChan === null) {
            interaction.followUp('Vous devez être connecté à un channel vocal pour utiliser la commande')
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
            const queue: YouTubeVideo[] = []

            connection.subscribe(audio)

            if (url.startsWith('https') && play.yt_validate(url) === 'video') {
                const music: YouTubeVideo = (await play.video_info(url)).video_details

                queue.push(music)
            } else if (url.startsWith('https') && play.yt_validate(url) === 'playlist') {
                (await (await play.playlist_info(
                    url,
                    {incomplete: true}
                )).all_videos()).map((music: YouTubeVideo) => {
                    if (!music.private) queue.push(music)
                })
            }

            if (queue.length > 0) {
                const getEmbed = () => {
                    const embed = new MessageEmbed()
                    embed.setColor('#00ff00')
                        .setTitle('Charle-Hubert FM')
                        .setThumbnail(client.user.avatarURL())
                        .addField('Musique', queue[0].title)
                        .setImage(queue[0].thumbnails[queue[0].thumbnails.length - 1].url)

                    return embed
                }
                const getActions = () => {
                    const actions = new MessageActionRow()
                    actions.addComponents(
                        new MessageButton()
                            .setCustomId('pause-resume')
                            .setStyle('PRIMARY')
                            .setLabel(
                                audio.state.status === 'playing' || audio.state.status === 'buffering' ? '⏸' : '▶'
                            ),
                        new MessageButton()
                            .setCustomId('stop')
                            .setStyle('DANGER')
                            .setLabel('🛑'),
                        new MessageButton()
                            .setCustomId('next')
                            .setStyle('PRIMARY')
                            .setLabel('⏭')
                            .setDisabled(queue.length <= 1),
                        new MessageButton()
                            .setCustomId('shuffle')
                            .setStyle('PRIMARY')
                            .setLabel('🔀')
                            .setDisabled(queue.length <= 1),
                        new MessageButton()
                            .setLabel('Voir la vidéo sur Youtube')
                            .setStyle('LINK')
                            .setURL(queue[0].url)
                    )

                    return actions
                }
                const playMusic = async () => {
                    const resource: YouTubeStream = await play.stream(queue[0].url, {quality: 2})
                    audio.play(Voice.createAudioResource(resource.stream, {
                        inputType: resource.type
                    }))
                }
                connection.subscribe(audio)
                await playMusic()
                interaction.followUp({embeds: [getEmbed()], components: [getActions()]})
                const cPauseResume: InteractionCollector<MessageComponentInteraction> = interaction.channel.createMessageComponentCollector({
                    filter: i => i.customId === 'pause-resume'
                })
                const cStop: InteractionCollector<MessageComponentInteraction> = interaction.channel.createMessageComponentCollector({
                    filter: i => i.customId === 'stop'
                })
                const cNext: InteractionCollector<MessageComponentInteraction> = interaction.channel.createMessageComponentCollector({
                    filter: i => i.customId === 'next'
                })
                const cShuffle: InteractionCollector<MessageComponentInteraction> = interaction.channel.createMessageComponentCollector({
                    filter: i => i.customId === 'shuffle'
                })
                cPauseResume.on('collect', (i: MessageComponentInteraction) => {
                    if (audio.pause()) {
                        i.reply('Musique en pause')
                    } else {
                        audio.unpause()
                        i.reply('Lecture de la musique')
                    }
                    interaction.editReply({embeds: [getEmbed()], components: [getActions()]})
                })
                cShuffle.on('collect', (i: MessageComponentInteraction) => {
                    i.reply('Changement de musique')
                    Utils.shuffle(queue)
                    playMusic()
                    interaction.editReply({embeds: [getEmbed()], components: [getActions()]})
                })
                const stop = (i: MessageComponentInteraction | CommandInteraction) => {
                    const message: string = 'Déconnexion'
                    interaction.editReply({embeds: [getEmbed()], components: []})
                    i.deferred ? i.followUp(message) : i.reply(message)
                    audio.removeAllListeners()
                    audio.stop()
                    cStop.stop()
                    cShuffle.stop()
                    cNext.stop()
                    cPauseResume.stop()
                    connection.destroy()
                }
                const next = (i: MessageComponentInteraction | CommandInteraction) => {
                    const message: string = 'Musique suivante'
                    queue.shift()
                    playMusic()
                    interaction.editReply({embeds: [getEmbed()], components: [getActions()]})
                    i.deferred ? i.followUp(message) : i.reply(message)
                }
                cStop.on('collect', stop)
                cNext.on('collect', next)
                audio.on(AudioPlayerStatus.Idle, () => {
                    queue.length > 1 ? next(interaction) : stop(interaction)
                })
            }
        }
    }
}
