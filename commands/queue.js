const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "queue",
    description: "see current queue",
    aliases: ['q'],
    args: false,
    guildOnly: true,
    async execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("**Queue**")
            .setTimestamp();

        const {queue} = message.client;
        console.log(queue.size);
    }
}