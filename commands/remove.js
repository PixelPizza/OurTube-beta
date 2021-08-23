const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "remove",
    description: "remove an item from the current queue",
    aliases: ['r'],
    args: true,
    usage: "<number index>",
    guildOnly: true,
    needsVoice: true,
    needsConnection: true,
    needsDispatcher: true,
    needsQueue: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId),
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Now Playing");

        if (settings.queue.length == 1){
            return message.channel.send(embedMsg
                .setColor(red)
                .setDescription(`I can't remove the currently playing number with ${settings.prefix}remove please use ${settings.prefix}skip!`));
        }

        if (args.length > 1){
            return message.channel.send(embedMsg
                .setColor(red)
                .setDescription(`${settings.prefix}${this.name} takes only one argument! The proper usage is ${settings.prefix}${this.name} ${this.usage}`));
        }

        if (isNaN(args[0])){
            return message.channel.send(embedMsg
                .setColor(red)
                .setDescription(`${args[0]} is not a valid round number!`));
        }

        const length = settings.queue.length - 1;
        const index = parseInt(args[0]);
        if (index > length){
            return message.channel.send(embedMsg
                .setColor(red)
                .setDescription(`There are only ${length} videos to remove!`));
        }
        
        settings.queue.splice(index, 1);
        client.settings.set(guildId, settings);
        message.channel.send(embedMsg.setDescription(`Removed index ${index} from the queue`));
    }
}