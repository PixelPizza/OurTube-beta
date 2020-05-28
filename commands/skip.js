const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "skip",
    description: "skip current song",
    aliases: ['s'],
    args: false,
    guildOnly: true,
    execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Skip")
            .setDescription(`Skipped Song`);

        if (!client.connection){
            embedMsg
                .setColor(red)
                .setTitle("Not connected")
                .setDescription(`I'm not connected to a voice channel!`);
            
            return message.channel.send(embedMsg);
        }

        if (!client.dispatcher || !client.queue.length){
            embedMsg
                .setColor(red)
                .setTitle("Not Playing")
                .setDescription(`I'm currently not playing anything!`);

            return message.channel.send(embedMsg);
        }

        if (client.queue.length > 1){
            client.queue.shift();
        } else {
            client.queue = [];
            client.dispatcher.end();
        }
        //client.dispatcher = null;
        message.channel.send(embedMsg);
    }
}