import * as Fs from 'fs'
import {Interaction} from 'discord.js'

export default class Utils {
    public static log(command: string, integration: Interaction) {
        console.log(`${command} envoyé par ${integration.user.tag} le ${(integration.createdAt as Date).toLocaleDateString('fr-FR')} à ${(integration.createdAt as Date).toLocaleTimeString('fr-FR')}`)

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

    public static shuffle(array: Array<any>) {
        let counter = array.length
        while (counter > 0) {
            const index = Math.floor(Math.random() * counter)
            counter -= 1
            const item = array[counter]
            array[counter] = array[index]
            array[index] = item
        }
        return array
    }
}
