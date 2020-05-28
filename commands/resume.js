const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');
const {pizzaGuild, emojis} = require('../config.json');

module.exports = {
    name: "resume",
    description: "resume paused song",
    aliases: ['res'],
    args: false,
    guildOnly: true,
    execute(message, args, client){
        const guild = client.guilds.cache.get(pizzaGuild);
        const play = guild.emojis.cache.get(emojis.play);

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

        client.dispatcher.pause();
        message.channel.send(embedMsg);
    }
}