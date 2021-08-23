const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "skip",
    description: "skip current song",
    aliases: ['s'],
    args: false,
    guildOnly: true,
    needsVoice: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId),
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Skip")
            .setDescription(`Skipped Song`);

        if (!settings.connection){
            embedMsg
                .setColor(red)
                .setTitle("Not connected")
                .setDescription(`I'm not connected to a voice channel!`);
            
            return message.channel.send(embedMsg);
        }

        if (!settings.queue.length){
            embedMsg
                .setColor(red)
                .setTitle("Not Playing")
                .setDescription(`I'm currently not playing anything!`);

            return message.channel.send(embedMsg);
        }

        if (settings.queue.length == 1){
            settings.queue = [];
        }
        settings.dispatcher.end();
        settings.dispatcher = null;
        client.settings.set(guildId, settings);
        message.channel.send(embedMsg);
    }
}