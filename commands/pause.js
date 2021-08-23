const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "pause",
    description: "pause the current song",
    args: false,
    guildOnly: true,
    needsVoice: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId),
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("⏸︎ Pause")
            .setDescription("Paused current song");

        if (!settings.connection){
            embedMsg
                .setColor(red)
                .setTitle("Not connected")
                .setDescription(`I'm not connected to a voice channel!`);
            
            return message.channel.send(embedMsg);
        }

        if (!settings.dispatcher || !settings.queue.length){
            embedMsg
                .setColor(red)
                .setTitle("Not Playing")
                .setDescription(`I'm currently not playing anything!`);

            return message.channel.send(embedMsg);
        }

        settings.dispatcher.pause();
        message.channel.send(embedMsg);
    }
}