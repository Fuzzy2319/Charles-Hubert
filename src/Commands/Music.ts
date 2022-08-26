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
    SlashCommandStringOption,
    VoiceBasedChannel
} from 'discord.js'
import {AppSlashCommandBuilder} from '../Utils/Builder.js'
import play, {YouTubePlayList, YouTubeStream, YouTubeVideo} from 'play-dl'
import * as Voice from '@discordjs/voice'
import QueueProvider from '../DataProviders/QueueProvider.js'

const command: AppSlashCommandBuilder = (new AppSlashCommandBuilder())
    .setName('musique')
    .setDescription('Joue une musique dans un channel vocal')
    .setDMPermission(false)
    .addStringOption(
        (new SlashCommandStringOption())
            .setName('url')
            .setDescription('Lien Youtube de la musique à jouer')
            .setRequired(true)
    )
    .setCallback(async (client: Client, interaction: CommandInteraction) => {
        await interaction.deferReply()
        const voiceChan: VoiceBasedChannel | null = (await interaction.guild.members.fetch(interaction.user.id))
            ?.voice
            .channel
        const url: string = interaction
            .options
            .data
            .find((option: CommandInteractionOption) => option.name === 'url')
            .value as string
        const queue: YouTubeVideo[] = QueueProvider.GetGuildQueue(interaction.guild)

        if (voiceChan === null) {
            await interaction.followUp('Vous devez être connecté à un channel vocal pour utiliser la commande')

            return
        }

        if (!url.startsWith('https')) {
            await interaction.followUp('Lien invalide le lien doit être un lien youtube valide')

            return
        }

        if (play.yt_validate(url) === 'video') {
            QueueProvider.AddToGuildQueue(interaction.guild, (await play.video_info(url)).video_details)
        }

        if (play.yt_validate(url) === 'playlist') {
            const playlist: YouTubePlayList = await play.playlist_info(url, {incomplete: true})
            QueueProvider.AddToGuildQueue(interaction.guild, ...(await playlist.all_videos()))
        }

        if (queue.length > 0 && Voice.getVoiceConnection(voiceChan.guild.id) !== undefined) {
            await interaction.followUp('Votre vidéo a été ajouté à queue')

            return
        }

        if (QueueProvider.GetGuildQueue(interaction.guild).length === 0) {
            await interaction.followUp('Votre vidéo ou votre playlist est privée impossible de la lire')

            return
        }


        const connection: Voice.VoiceConnection = Voice.joinVoiceChannel({
            channelId: voiceChan.id,
            guildId: voiceChan.guild.id,
            adapterCreator: voiceChan.guild.voiceAdapterCreator
        })

        const audio: Voice.AudioPlayer = Voice.createAudioPlayer({
            behaviors: {
                noSubscriber: Voice.NoSubscriberBehavior.Play
            }
        })

        connection.subscribe(audio)

        const getEmbed = () => {
            return (new EmbedBuilder())
                .setColor('#00ff00')
                .setTitle('Charle-Hubert FM')
                .setThumbnail(client.user.avatarURL())
                .addFields({
                    name: 'Musique',
                    inline: false,
                    value: QueueProvider.GetGuildQueue(interaction.guild)[0].title
                })
                .setImage(QueueProvider.GetGuildQueue(interaction.guild)[0].thumbnail.url)
        }

        const getActions = () => {
            return (new ActionRowBuilder())
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('pause-resume')
                        .setStyle(ButtonStyle.Primary)
                        .setLabel(
                            audio.state.status === Voice.AudioPlayerStatus.Playing ||
                            audio.state.status === Voice.AudioPlayerStatus.Buffering
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
                        .setLabel('Voir la vidéo sur Youtube')
                        .setStyle(ButtonStyle.Link)
                        .setURL(QueueProvider.GetGuildQueue(interaction.guild)[0].url)
                )
                .toJSON() as ActionRow<ButtonComponent>
        }

        const playMusic = async () => {
            try {
                const resource: YouTubeStream = await play.stream(QueueProvider.GetGuildQueue(interaction.guild)[0].url, {quality: 2})

                audio.play(Voice.createAudioResource(resource.stream, {
                    inputType: resource.type
                }))
            } catch {
                const resource: YouTubeStream = await play.stream('https://youtu.be/t69tmdgqKFk', {quality: 2})

                audio.play(Voice.createAudioResource(resource.stream, {
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
            message = await message.delete()
            message = await message.channel.send({embeds: [getEmbed()], components: [getActions()]})
        })

        cShuffle.on('collect', async () => {
            QueueProvider.ShuffleGuildQueue(interaction.guild)
            await playMusic()
            message = await message.delete()
            message = await message.channel.send({embeds: [getEmbed()], components: [getActions()]})
        })

        const stop = async () => {
            connection.removeAllListeners()
            audio.removeAllListeners()
            message = await message.delete()
            message = await message.channel.send(`Fin de la lecture de ${url}, déconnexion`)
            QueueProvider.ClearQueue(interaction.guild)
            audio.stop()
            cStop.stop()
            cShuffle.stop()
            cNext.stop()
            cPauseResume.stop()
            if (connection.state.status !== 'destroyed') {
                connection.destroy()
            }
        }

        const next = async () => {
            QueueProvider.ShiftGuildQueue(interaction.guild)
            await playMusic()
            message = await message.delete()
            message = await message.channel.send({embeds: [getEmbed()], components: [getActions()]})
        }

        cStop.on('collect', stop)

        cNext.on('collect', next)

        audio.on(Voice.AudioPlayerStatus.Idle, () => {
            QueueProvider.GetGuildQueue(interaction.guild).length > 1 ? next() : stop()
        })

        connection.on(Voice.VoiceConnectionStatus.Disconnected, stop)
        connection.on(Voice.VoiceConnectionStatus.Destroyed, stop)
    })

export default command
