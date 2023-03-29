import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus
} from '@discordjs/voice'
import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonComponent,
    ButtonInteraction,
    ButtonStyle,
    Client,
    CommandInteraction,
    CommandInteractionOption,
    EmbedBuilder,
    InteractionCollector,
    Message,
    VoiceBasedChannel
} from 'discord.js'
import play from 'play-dl'
import { YoutubeVideoInfo } from '../App.js'
import QueueProvider from '../DataProviders/QueueProvider.js'
import { AppSlashCommandBuilder, AppSlashCommandStringOption } from '../Utils/Builder.js'
import translator from '../Utils/Translator.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('command.music.name')
    .setDescription('command.music.description')
    .setDMPermission(false)
    .addStringOption(
        (new AppSlashCommandStringOption())
            .setName('command.music.option.url.name')
            .setDescription('command.music.option.url.description')
            .setRequired(true)
    )
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        let rep: boolean = false
        const voiceChan: VoiceBasedChannel | null = (await interaction.guild.members.fetch(interaction.user.id))
            ?.voice
            .channel
        const url: string = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === translator.getTranslation('command.music.option.url.name'))
            .value as string
        const queue: YoutubeVideoInfo[] = QueueProvider.GetGuildQueue(interaction.guild)

        if (voiceChan === null) {
            await interaction.reply({
                content: translator.getTranslation('command.music.action.error.not_connected', interaction.guild.preferredLocale),
                ephemeral: true
            })

            return
        }

        if (!url.startsWith('https') || !play.yt_validate(url)) {
            await interaction.reply({
                content: translator.getTranslation('command.music.action.error.link_not_valid', interaction.guild.preferredLocale),
                ephemeral: true
            })

            return
        }

        if (play.yt_validate(url) === 'video') {
            QueueProvider.AddToGuildQueue(interaction.guild, (await play.video_info(url)).video_details)
        }

        if (play.yt_validate(url) === 'playlist') {
            const playlist: play.YouTubePlayList = await play.playlist_info(url, { incomplete: true })
            QueueProvider.AddToGuildQueue(interaction.guild, ...(await playlist.all_videos()))
        }

        if (queue.length > 0) {
            rep = true
            await interaction.reply({
                content: translator.getTranslation('command.music.action.added_to_queue', interaction.guild.preferredLocale),
                ephemeral: true
            })
        }

        if (getVoiceConnection(voiceChan.guild.id) !== undefined) {
            return
        }

        if (QueueProvider.GetGuildQueue(interaction.guild).length === 0) {
            await interaction.reply({
                content: translator.getTranslation('command.music.action.error.private', interaction.guild.preferredLocale),
                ephemeral: true
            })

            return
        }

        if (!rep) {
            await interaction.deferReply()
        }
        const connection: VoiceConnection = joinVoiceChannel({
            channelId: voiceChan.id,
            guildId: voiceChan.guild.id,
            adapterCreator: voiceChan.guild.voiceAdapterCreator
        })

        const audio: AudioPlayer = createAudioPlayer()

        connection.subscribe(audio)

        const getEmbed = () => {
            return (new EmbedBuilder())
                .setColor('#00ff00')
                .setTitle('Charle-Hubert FM')
                .setThumbnail(client.user.avatarURL())
                .addFields({
                    name: translator.getTranslation('command.music.embed.field.name', interaction.guild.preferredLocale),
                    inline: false,
                    value: QueueProvider.GetGuildQueue(interaction.guild)[0].title
                })
                .setImage(
                    QueueProvider.GetGuildQueue(interaction.guild)[0].thumbnail.url
                )
        }

        const getActions = () => {
            return (new ActionRowBuilder())
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('pause-resume')
                        .setStyle(ButtonStyle.Primary)
                        .setLabel(
                            audio.state.status === AudioPlayerStatus.Playing ||
                                audio.state.status === AudioPlayerStatus.Buffering
                                ? '⏸' : '▶'
                        ),
                    new ButtonBuilder()
                        .setCustomId('stop')
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('🛑'),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('⏭')
                        .setDisabled(QueueProvider.GetGuildQueue(interaction.guild).length <= 1),
                    new ButtonBuilder()
                        .setCustomId('shuffle')
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('🔀')
                        .setDisabled(QueueProvider.GetGuildQueue(interaction.guild).length <= 1),
                    new ButtonBuilder()
                        .setLabel(translator.getTranslation('command.music.embed.button.link', interaction.guild.preferredLocale))
                        .setStyle(ButtonStyle.Link)
                        .setURL(QueueProvider.GetGuildQueue(interaction.guild)[0].url)
                )
                .toJSON() as ActionRow<ButtonComponent>
        }

        const playMusic = async () => {
            try {
                const resource: play.YouTubeStream = await play.stream(QueueProvider.GetGuildQueue(interaction.guild)[0].url, { quality: 2 })

                audio.play(createAudioResource(resource.stream, {
                    inputType: resource.type
                }))
            } catch {
                const resource: play.YouTubeStream = await play.stream('https://youtu.be/t69tmdgqKFk', { quality: 2 })

                audio.play(createAudioResource(resource.stream, {
                    inputType: resource.type
                }))
            }
        }

        await playMusic()

        let message: Message = await interaction.followUp(
            {
                embeds: [getEmbed()],
                components: [getActions()],
                fetchReply: true
            }
        )

        const cPauseResume: InteractionCollector<ButtonInteraction> = interaction
            .channel
            .createMessageComponentCollector({
                filter: i => i.customId === 'pause-resume'
            }) as InteractionCollector<ButtonInteraction>

        const cStop: InteractionCollector<ButtonInteraction> = interaction
            .channel
            .createMessageComponentCollector({
                filter: i => i.customId === 'stop'
            }) as InteractionCollector<ButtonInteraction>

        const cNext: InteractionCollector<ButtonInteraction> = interaction
            .channel
            .createMessageComponentCollector({
                filter: i => i.customId === 'next'
            }) as InteractionCollector<ButtonInteraction>

        const cShuffle: InteractionCollector<ButtonInteraction> = interaction
            .channel
            .createMessageComponentCollector({
                filter: i => i.customId === 'shuffle'
            }) as InteractionCollector<ButtonInteraction>

        cPauseResume.on('collect', async () => {
            audio.pause(true) || audio.unpause()
            if (message.deletable) {
                message = await message.delete()
            }
            message = await message.channel.send({ embeds: [getEmbed()], components: [getActions()] })
        })

        cShuffle.on('collect', async () => {
            QueueProvider.ShuffleGuildQueue(interaction.guild)
            await playMusic()
            if (message.deletable) {
                message = await message.delete()
            }
            message = await message.channel.send({ embeds: [getEmbed()], components: [getActions()] })
        })

        const stop = async () => {
            connection.removeAllListeners()
            audio.removeAllListeners()
            if (message.deletable) {
                message = await message.delete()
            }
            message = await message.channel.send(translator.getTranslation(
                'command.music.action.done',
                interaction.guild.preferredLocale,
                [QueueProvider.GetGuildQueue(interaction.guild)[0].url]
            ))
            QueueProvider.ClearQueue(interaction.guild)
            audio.stop()
            cStop.stop()
            cShuffle.stop()
            cNext.stop()
            cPauseResume.stop()
            if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                connection.destroy()
            }
        }

        const next = async () => {
            QueueProvider.ShiftGuildQueue(interaction.guild)
            await playMusic()
            if (message.deletable) {
                message = await message.delete()
            }
            message = await message.channel.send({ embeds: [getEmbed()], components: [getActions()] })
        }

        cStop.on('collect', stop)

        cNext.on('collect', next)

        audio.on(AudioPlayerStatus.Idle, () => {
            QueueProvider.GetGuildQueue(interaction.guild).length > 1 ? next() : stop()
        })

        connection.on(VoiceConnectionStatus.Disconnected, stop)
        connection.on(VoiceConnectionStatus.Destroyed, stop)
    })

export default command
