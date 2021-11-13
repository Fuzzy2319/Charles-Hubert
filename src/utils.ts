import * as Fs from 'fs'

export class Utils {
    public static log(command: string, integration) {
        console.log(`${command} send by ${integration.user.username} on ${integration.createdAt}`)

        try {
            Fs.appendFile("./command.log", command + " send by " + integration.user.username + " on " + integration.createdAt + "\n", error => {
                if (error) {
                    throw error
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    public static sleep(ms) {
        const date = Date.now()
        let currentDate = null

        do {
            currentDate = Date.now()
        } while (currentDate - date < ms)
    }
}



        /*sleep = ms => {
            const date = Date.now()
            let currentDate = null
            do {
                currentDate = Date.now()
            } while (currentDate - date < ms)
        }

        randomInt = (min, max) => {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        shuffle = array => {
            let counter = array.length
            while (counter > 0) {
                let index = Math.floor(Math.random() * counter)
                counter += -1
                let temp = array[counter]
                array[counter] = array[index]
                array[index] = temp
            }
            return array
        }

        play = client => {
            const Ytdl = require("ytdl-core")
            const Utils = require("./utils.js")

            client.audio = client.connexion.play(Ytdl(client.queue[0].shortUrl, {
                filter: "audioonly",
                quality: "highestaudio",
            }), {
                volume: 0.3,
            })
            client.audio.on("finish", () => {
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
        };*/
    

    /*Vid = class {
        title
        shortUrl
        bestThumbnail
        constructor(title, shortUrl, bestThumbnail) {
            this.title = title
            this.shortUrl = shortUrl
            this.bestThumbnail = bestThumbnail
        }
    };

    Thumb = class {
        url
        constructor(url) {
            this.url = url;
        }
    }*/