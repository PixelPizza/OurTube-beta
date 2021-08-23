const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "resume",
    description: "resume paused song",
    aliases: ['res'],
    args: false,
    guildOnly: true,
    needsVoice: true,
    needsConnection: true,
    needsDispatcher: true,
    needsQueue: true,
    execute(message, args, client){
        client.settings.get(message.guild.id).dispatcher.resume();
        message.channel.send(new MessageEmbed()
            .setColor(blue)
            .setTitle(`▶️ Resume`)
            .setDescription("Resuming song"));
    }
}
