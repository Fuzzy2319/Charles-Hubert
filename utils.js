import * as Fs from 'fs';
export class Utils {
    static log(command, integration) {
        console.log(`${command} send by ${integration.user.username} on ${integration.createdAt}`);
        try {
            Fs.appendFile("./command.log", command + " send by " + integration.user.username + " on " + integration.createdAt + "\n", error => {
                if (error) {
                    throw error;
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    static sleep(ms) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < ms);
    }
}
