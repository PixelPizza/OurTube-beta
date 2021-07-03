const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "replay",
    description: "play current song from the beginning",
    args: false,
    guildOnly: true,
    needsVoice: true,
    execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Replay")
            .setDescription(`Replaying current song`);

        if (!client.connection){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not connected to a voice channel!`);

            return message.channel.send(embedMsg);
        }

        if (!client.dispatcher){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not playing anything!`);

            return message.channel.send(embedMsg);
        }

        client.replay = true;
        client.dispatcher.end();
        message.channel.send(embedMsg);
    }
}