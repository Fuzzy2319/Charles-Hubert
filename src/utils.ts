import * as Fs from 'fs'
//import * as Ytdl from 'ytdl-core'

export class Utils {
    public static log = (command: string, integration) => {
        console.log(`${command} send by ${integration.user.username} on ${integration.createdAt}`)

        try {
            Fs.appendFile('./command.log', `${command} send by ${integration.user.username} on ${integration.createdAt}\n`, error => {
                if (error) {
                    throw error
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    public static sleep = (ms: number) => {
        const date: number = Date.now()
        let currentDate: number = null

        do {
            currentDate = Date.now()
        } while (currentDate - date < ms)
    }

    public static randomInt = (min: number, max: number) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    public static shuffle = (array: []) => {
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

export class Vid {
    public title: string
    public shortUrl: string
    public bestThumbnail: Thumb

    constructor(title: string, shortUrl: string, bestThumbnail: Thumb) {
        this.title = title
        this.shortUrl = shortUrl
        this.bestThumbnail = bestThumbnail
    }
}

export class Thumb {
    public url: string
    constructor(url: string) {
        this.url = url;
    }
}