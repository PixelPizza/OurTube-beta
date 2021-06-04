const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "volume",
    description: "change volume",
    aliases: ['vol'],
    usage: "<volume percentage>",
    guildOnly: true,
    execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Volume");

        if (!client.dispatcher){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not playing anything!`);

            return message.channel.send(embedMsg);
        }

        if (!args.length){
            embedMsg.setDescription(`The current volume is ${client.volume}%`);
            return message.channel.send(embedMsg);
        }

        if (args.length > 1){
            embedMsg
                .setColor(red)
                .setDescription(`${client.prefix}${this.name} takes one argument! The proper usage is ${client.prefix}${this.name} ${this.usage}`);
        
            return message.channel.send(embedMsg);
        }

        if (isNaN(args[0])){
            embedMsg
                .setColor(red)
                .setDescription(`The volume percentage should be a round number!`);

            return message.channel.send(embedMsg);
        }

        const volume = parseInt(args);

        if (volume < 1 || volume > 200){
            embedMsg
                .setColor(red)
                .setDescription(`The volume percentage should be a number between 1% and 200%`);

            return message.channel.send(embedMsg);
        }

        client.dispatcher.setVolume(volume / 100);
        client.volume = volume;
        embedMsg.setDescription(`The volume has been changed to ${volume}%`);
        message.channel.send(embedMsg);
    }
}