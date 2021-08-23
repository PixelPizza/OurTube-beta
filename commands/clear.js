const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "clear",
    description: "clear the queue",
    aliases: ['cl'],
    args: false,
    guildOnly: true,
    needsVoice: true,
    needsConnection: true,
    needsDispatcher: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId);

        settings.queue = [];
        settings.dispatcher.end();
        client.settings.set(guildId, settings);
        message.channel.send(new MessageEmbed()
            .setColor(blue)
            .setTitle("Clear")
            .setDescription(`The queue has been cleared!`));
    }
}