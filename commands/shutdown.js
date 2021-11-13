import { Utils } from '../utils.js';
export const command = {
    name: 'shutdown',
    description: 'Arrête le bot. Utilisable uniquement par Le créateur du bot',
    execute: function (client, integration) {
        if ((integration.user.id === '454682288563683329') && (integration.channel.name === 'control-pannel')) {
            Utils.log(this.name, integration);
            console.log('Arrêt de Charles-Hubert...');
            client.voice.adapters?.forEach(connexion => {
                connexion.destroy();
            });
            integration.reply('Arrêt de Charles-Hubert');
            integration.fetchReply().then((message) => {
                Utils.sleep(500);
                message.edit('Arrêt de Charles-Hubert.').then((message) => {
                    Utils.sleep(1000);
                    message.edit('Arrêt de Charles-Hubert..').then((message) => {
                        Utils.sleep(1000);
                        message.edit('Arrêt de Charles-Hubert...').then(() => {
                            client.destroy();
                        });
                    });
                });
            });
        }
    }
};
