const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "resume",
    description: "resume paused song",
    aliases: ['res'],
    args: false,
    guildOnly: true,
    needsVoice: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId),
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle(`▶️ Resume`)
            .setDescription("Resuming song");

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

        settings.dispatcher.resume();
        message.channel.send(embedMsg);
    }
}
