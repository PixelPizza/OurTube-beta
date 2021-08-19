const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "clear",
    description: "clear the queue",
    aliases: ['cl'],
    args: false,
    guildOnly: true,
    needsVoice: true,
    execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Clear")
            .setDescription(`The queue has been cleared!`);

        if (!client.settings.connection){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not connected to a voice channel!`);

            return message.channel.send(embedMsg);
        }

        if (!client.settings.dispatcher){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not playing anything!`);

            return message.channel.send(embedMsg);
        }

        client.settings.queue = [];
        client.settings.dispatcher.end();
        message.channel.send(embedMsg);
    }
}