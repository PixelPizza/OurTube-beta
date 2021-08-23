const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "skip",
    description: "skip current song",
    aliases: ['s'],
    args: false,
    guildOnly: true,
    needsVoice: true,
    needsConnection: true,
    needsDispatcher: true,
    needsQueue: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId);

        if (settings.queue.length == 1) settings.queue = [];
        settings.dispatcher.end();
        settings.dispatcher = null;
        client.settings.set(guildId, settings);
        message.channel.send(new MessageEmbed()
            .setColor(blue)
            .setTitle("Skip")
            .setDescription(`Skipped Song`));
    }
}