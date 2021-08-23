const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "pause",
    description: "pause the current song",
    args: false,
    guildOnly: true,
    needsVoice: true,
    needsConnection: true,
    needsDispatcher: true,
    needsQueue: true,
    execute(message, args, client){
        client.settings.get(message.guild.id).dispatcher.pause();
        message.channel.send(new MessageEmbed()
            .setColor(blue)
            .setTitle("⏸︎ Pause")
            .setDescription("Paused current song"));
    }
}