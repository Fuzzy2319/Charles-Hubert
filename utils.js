module.exports = {
    log: (command, message) => {
        const Fs = require("fs");

        console.log(command + " send by " + message.author.username + " on " + message.createdAt);
        try {
            Fs.appendFile("./command.log", command + " send by " + message.author.username + " on " + message.createdAt + "\n", error => {
                if (error) {
                    throw error;
                };
            });
        }
        catch (error) {
            console.log(error);
        }
    },

    sleep: ms => {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < ms);
    },

    randomInt: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    shuffle: array => {
        let counter = array.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter += -1;
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    },

    play: client => {
        const Ytdl = require("ytdl-core");

        client.audio = client.connexion.play(Ytdl(client.queue[0].shortUrl, {
            filter: "audioonly",
            quality: "highestaudio",
        }), {
            volume: 0.3,
        });
        client.audio.on("finish", () => {
            if (client.queue.length > 1) {
                client.queue.shift();
                this.play(client);
            }
            else {
                client.queue = [];
                client.audio = null;
                client.connexion.disconnect();
            }
        });
    },
    Vid: class {
        title;
        shortUrl;
        bestThumbnail;
        constructor(title, shortUrl, bestThumbnail) {
            this.title = title;
            this.shortUrl = shortUrl;
            this.bestThumbnail = bestThumbnail;
        }
    },
    Thumb: class {
        url
        constructor(url) {
            this.url = url;
        }
    }
};