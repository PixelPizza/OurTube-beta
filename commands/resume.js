const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "resume",
    description: "resume paused song",
    aliases: ['res'],
    args: false,
    guildOnly: true,
    execute(message, args, client)

        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle(`${play} Resume`)
            .setDescription("Resuming song");

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

        client.dispatcher.resume();
        message.channel.send(embedMsg);
    }
}
