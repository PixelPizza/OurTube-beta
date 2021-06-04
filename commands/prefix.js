const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "prefix",
    description: "change prefix",
    usage: "<prefix>",
    guildOnly: true,
    execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Prefix");

        if (!args.length){
            embedMsg.setDescription(`The current prefix is \`${client.prefix}\``);
            return message.channel.send(embedMsg);
        }

        if (args.length > 1){
            embedMsg
                .setColor(red)
                .setDescription(`${client.prefix}${this.name} takes one argument! The proper usage is ${client.prefix}${this.name} ${this.usage}`);
            
            return message.channel.send(embedMsg);
        }

        if (args[0].length > 30){
            embedMsg
                .setColor(red)
                .setDescription(`The maximum length of the prefix is 30 characters!`);

            return message.channel.send(embedMsg);
        }

        client.prefix = args[0];
        embedMsg.setDescription(`The prefix has been set to \`${client.prefix}\``);
        message.channel.send(embedMsg);
    }
}