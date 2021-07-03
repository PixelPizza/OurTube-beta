const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');
const {prefix} = require('../config.json');

module.exports = {
    name: "remove",
    description: "remove an item from the current queue",
    aliases: ['r'],
    args: true,
    usage: "<number index>",
    guildOnly: true,
    needsVoice: true,
    execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Now Playing");

        if (!client.connection){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not connected to a voice channel!`);

            return message.channel.send(embedMsg);
        }

        if (!client.dispatcher || !client.queue.length){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not playing anything!`);

            return message.channel.send(embedMsg);
        }

        if (client.queue.length == 1){
            embedMsg
                .setColor(red)
                .setDescription(`I can't remove the currently playing number with ${prefix}remove please use ${prefix}skip!`);

            return message.channel.send(embedMsg);
        }

        if (args.length > 1){
            embedMsg
                .setColor(red)
                .setDescription(`${prefix}${this.name} takes only one argument! The proper usage is ${prefix}${this.name} ${this.usage}`);

            return message.channel.send(embedMsg);
        }

        if (isNaN(args[0])){
            embedMsg
                .setColor(red)
                .setDescription(`${args[0]} is not a valid round number!`);

            return message.channel.send(embedMsg);
        }

        const length = client.queue.length - 1;
        const index = parseInt(args[0]);
        if (index > length){
            embedMsg
                .setColor(red)
                .setDescription(`There are only ${length} videos to remove!`);

            return message.channel.send(embedMsg);
        }
        
        client.queue.splice(index, 1);
        embedMsg.setDescription(`Removed index ${index} from the queue`);
        message.channel.send(embedMsg);
    }
}