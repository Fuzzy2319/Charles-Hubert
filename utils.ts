import * as Fs from 'fs'
import * as Voice from '@discordjs/voice'
import {YouTubeStream} from 'play-dl'
import {Interaction} from 'discord.js'

export default class Utils {
    public static log(command: string, integration: Interaction) {
        console.log(`${command} envoyé par ${integration.user.username} le ${(integration.createdAt as Date).toLocaleDateString('fr-FR')} à ${(integration.createdAt as Date).toLocaleTimeString('fr-FR')}`)

        Fs.appendFile('./command.log', `${command} envoyé par ${integration.user.username} le ${(integration.createdAt as Date).toLocaleDateString('fr-FR')} à ${(integration.createdAt as Date).toLocaleTimeString('fr-FR')}\n`, error => {
            if (error) {
                console.log(error)
            }
        })
    }

    public static async sleep(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms))
    }

    public static randomInt(min: number, max: number) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    public static shuffle(array: []) {
        let counter = array.length
        while (counter > 0) {
            const index = Math.floor(Math.random() * counter)
            counter -= 1
            const temp = array[counter]
            array[counter] = array[index]
            array[index] = temp
        }
        return array
    }

    public static play = async (audio: Voice.AudioPlayer, queue: Array<YouTubeStream>) => {
        await new Promise<void>(resolve => {
            audio.play(Voice.createAudioResource(queue[0].stream, {
                inputType: queue[0].type
            }))

            audio.on('error', console.error)

            audio.on(Voice.AudioPlayerStatus.Idle, () => {
                audio.removeAllListeners()
                queue.shift()

                if (queue.length > 0) {
                    Utils.play(audio, queue)
                } else {
                    resolve()
                }
            })
        })
    }

    /*public static play = (client) => {

        client.audio = client.connexion.play(Ytdl(client.queue[0].shortUrl, {
            filter: 'audioonly',
            quality: 'highestaudio',
        }), {
            volume: 0.3,
        })
        client.audio.on('finish', () => {
            if (client.queue.length > 1) {
                client.queue.shift()
                Utils.play(client)
            }
            else {
                client.queue = []
                client.audio = null
                client.connexion.disconnect()
            }
        })
    }*/
}
