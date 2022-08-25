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
        const queue: YouTubeVideo[] = []
        if (voiceChan === null) {
            await interaction.followUp('Vous devez être connecté à un channel vocal pour utiliser la commande')

            return
        }
        if (!url.startsWith('https')) {
            await interaction.followUp('Lien invalide le lien doit être un lien youtube valide')

            return
        }
        if (play.yt_validate(url) === 'video') {
            queue.push((await play.video_info(url)).video_details)
        }
        if (play.yt_validate(url) === 'playlist') {
            const playlist: YouTubePlayList = await play.playlist_info(url, {incomplete: false})
            const videos: YouTubeVideo[] = await playlist.all_videos()
            videos.map((music: YouTubeVideo) => {
                if (!music.private) {
                    queue.push(music)
                }
            })
        }
        if (queue.length === 0) {
            await interaction.followUp('Votre vidéo ou votre playlist est privée impossible de la lire')

            return
        }
        const connection = Voice.joinVoiceChannel({
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
                    value: queue[0].title
                })
                .setImage(queue[0].thumbnails[queue[0].thumbnails.length - 1].url)
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
                        .setDisabled(queue.length <= 1),
                    new ButtonBuilder()
                        .setCustomId('shuffle')
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('🔀')
                        .setDisabled(queue.length <= 1),
                    new ButtonBuilder()
                        .setLabel('Voir la vidéo sur Youtube')
                        .setStyle(ButtonStyle.Link)
                        .setURL(queue[0].url)
                )
                .toJSON() as ActionRow<ButtonComponent>
        }
        const playMusic = async () => {
            try {
                const resource: YouTubeStream = await play.stream(queue[0].url, {quality: 2})
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
            audio.pause() || audio.unpause()
            message = await message.delete()
            message = await message.channel.send({embeds: [getEmbed()], components: [getActions()]})
        })
        cShuffle.on('collect', async () => {
            // shuffle(queue)
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
        audio.on(Voice.AudioPlayerStatus.Idle, () => {
            queue.length > 1 ? next() : stop()
        })
    })

export default command
