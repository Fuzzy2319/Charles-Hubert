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
            }

            if (queue.length > 0) {
                const embed = new MessageEmbed()
                const actions = new MessageActionRow()
                embed.setColor('#00ff00')
                    .setTitle('Charle-Hubert FM')
                    .setThumbnail(client.user.avatarURL())
                    .addField('Musique', queue[0].title)
                    .setImage(queue[0].thumbnails[queue[0].thumbnails.length - 1].url)
                actions.addComponents(
                    new MessageButton()
                        .setCustomId('pause-resume')
                        .setStyle('PRIMARY')
                        .setLabel('⏯'),
                    new MessageButton()
                        .setCustomId('stop')
                        .setStyle('DANGER')
                        .setLabel('🛑'),
                    new MessageButton()
                        .setCustomId('next')
                        .setStyle('PRIMARY')
                        .setLabel('⏭')
                        .setDisabled(queue.length <= 1)
                )
                interaction.followUp({embeds: [embed], components: [actions]})
                const cPauseResume: InteractionCollector<MessageComponentInteraction> = interaction.channel.createMessageComponentCollector({
                    filter: i => i.customId === 'pause-resume'
                })
                const cStop: InteractionCollector<MessageComponentInteraction> = interaction.channel.createMessageComponentCollector({
                    filter: i => i.customId === 'stop'
                })
                connection.subscribe(audio)
                const resource: YouTubeStream = await play.stream(queue[0].url, {quality: 2})
                audio.play(Voice.createAudioResource(resource.stream, {
                    inputType: resource.type
                }))
                cPauseResume.on('collect', async (i: MessageComponentInteraction) => {
                    if (audio.pause()) {
                        i.reply('Musique en pause')
                    } else {
                        audio.unpause()
                        i.reply('Lecture de la musique')
                    }
                })
                const stop = async (i: MessageComponentInteraction | CommandInteraction) => {
                    interaction.editReply({embeds: [embed], components: []})
                    i.deferred ? i.followUp('Déconnexion') : i.reply('Déconnexion')
                    audio.removeAllListeners()
                    connection.destroy()
                }
                cStop.on('collect', stop)
                audio.on(AudioPlayerStatus.Idle, () => {
                    stop(interaction)
                })
            }
        }
    }
}
