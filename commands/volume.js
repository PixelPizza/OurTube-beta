const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "volume",
    description: "change volume",
    aliases: ['vol'],
    usage: "<volume percentage>",
    guildOnly: true,
    needsVoice: true,
    needsConnection: true,
    needsDispatcher: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId),
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Volume");

        if (!args.length) return message.channel.send(embedMsg.setDescription(`The current volume is ${settings.volume}%`));
        if (args.length > 1){
            return message.channel.send(embedMsg
                .setColor(red)
                .setDescription(`${settings.prefix}${this.name} takes one argument! The proper usage is ${settings.prefix}${this.name} ${this.usage}`));
        }
        if (isNaN(args[0])){
            return message.channel.send(embedMsg
                .setColor(red)
                .setDescription(`The volume percentage should be a round number!`));
        }

        const volume = parseInt(args);

        if (volume < 1 || volume > 200){
            return message.channel.send(embedMsg
                .setColor(red)
                .setDescription(`The volume percentage should be a number between 1% and 200%`));
        }

        settings.dispatcher.setVolume(volume / 100);
        settings.volume = volume;
        client.settings.set(guildId, settings);
        message.channel.send(embedMsg.setDescription(`The volume has been changed to ${volume}%`));
    }
}