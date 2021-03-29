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
    }
};