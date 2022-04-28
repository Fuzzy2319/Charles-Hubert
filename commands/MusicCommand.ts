import {
    Client,
    CommandInteraction,
    CommandInteractionOption,
    GuildMember,
    InteractionCollector,
    Message,
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
    VoiceChannel
} from 'discord.js'
import Utils from '../Utils.js'
import * as Voice from '@discordjs/voice'
import {AudioPlayerStatus} from '@discordjs/voice'
import play, {YouTubeStream, YouTubeVideo} from 'play-dl'
import {AppCommandOption, AppCommandWithOptions} from '../App'

export default class MusicCommand implements AppCommandWithOptions {
    public name: string
    public description: string
    public type: 1
    public options: AppCommandOption[]

    constructor() {
        this.name = 'musique'
        this.description = 'Joue une musique dans un channel vocal'
        this.type = 1
        this.options = [
            {
                name: 'url',
                description: 'Lien de la musique à jouer',
                type: 3,
                required: true
            }
        ]
    }

    async execute(client: Client, interaction: CommandInteraction) {
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
            const queue: YouTubeVideo[] = []
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
            } else {
                interaction.followUp('Lien invalide le lien doit être un lien youtube valide')
            }
            if (queue.length > 0) {
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
                connection.subscribe(audio)
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
                let message: Message =
                    await interaction.followUp({embeds: [getEmbed()], components: [getActions()]}) as Message
                const cPauseResume: InteractionCollector<MessageComponentInteraction> = interaction.channel
                    .createMessageComponentCollector({
                        filter: i => i.customId === 'pause-resume'
                    })
                const cStop: InteractionCollector<MessageComponentInteraction> = interaction.channel
                    .createMessageComponentCollector({
                        filter: i => i.customId === 'stop'
                    })
                const cNext: InteractionCollector<MessageComponentInteraction> = interaction.channel
                    .createMessageComponentCollector({
                        filter: i => i.customId === 'next'
                    })
                const cShuffle: InteractionCollector<MessageComponentInteraction> = interaction.channel
                    .createMessageComponentCollector({
                        filter: i => i.customId === 'shuffle'
                    })
                cPauseResume.on('collect', async () => {
                    audio.pause() || audio.unpause()
                    message = await message.delete()
                    message =
                        await message.channel.send({embeds: [getEmbed()], components: [getActions()]})
                })
                cShuffle.on('collect', async () => {
                    Utils.shuffle(queue)
                    await playMusic()
                    message = await message.delete()
                    message =
                        await message.channel.send({embeds: [getEmbed()], components: [getActions()]})
                })
                const stop = async () => {
                    message = await message.delete()
                    message =
                        await message.channel.send(`Fin de la lecture de ${url}, déconnexion`)
                    audio.removeAllListeners()
                    audio.stop()
                    cStop.stop()
                    cShuffle.stop()
                    cNext.stop()
                    cPauseResume.stop()
                    connection.destroy()
                }
                const next = async () => {
                    queue.shift()
                    await playMusic()
                    message = await message.delete()
                    message =
                        await message.channel.send({embeds: [getEmbed()], components: [getActions()]})
                }
                cStop.on('collect', stop)
                cNext.on('collect', next)
                audio.on(AudioPlayerStatus.Idle, () => {
                    queue.length > 1 ? next() : stop()
                })
            }
        }
    }
}
