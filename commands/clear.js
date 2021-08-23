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
        const guildId = message.guild.id,
            settings = client.settings.get(guildId),
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Clear")
            .setDescription(`The queue has been cleared!`);

        if (!settings.connection){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not connected to a voice channel!`);

            return message.channel.send(embedMsg);
        }

        if (!settings.dispatcher){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not playing anything!`);

            return message.channel.send(embedMsg);
        }

        settings.queue = [];
        settings.dispatcher.end();
        client.settings.set(guildId, settings);
        message.channel.send(embedMsg);
    }
}