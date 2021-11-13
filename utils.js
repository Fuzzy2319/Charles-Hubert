import * as Fs from 'fs';
export class Utils {
}
Utils.log = (command, integration) => {
    console.log(`${command} send by ${integration.user.username} on ${integration.createdAt}`);
    try {
        Fs.appendFile('./command.log', `${command} send by ${integration.user.username} on ${integration.createdAt}\n`, error => {
            if (error) {
                throw error;
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
Utils.sleep = (ms) => {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < ms);
};
Utils.randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
Utils.shuffle = (array) => {
    let counter = array.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter -= 1;
        const temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
};
export class Vid {
    constructor(title, shortUrl, bestThumbnail) {
        this.title = title;
        this.shortUrl = shortUrl;
        this.bestThumbnail = bestThumbnail;
    }
}
export class Thumb {
    constructor(url) {
        this.url = url;
    }
}
