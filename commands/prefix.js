const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "prefix",
    description: "change prefix",
    args: true,
    usage: "<prefix>",
    guildOnly: true,
    execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Prefix");

        if (args.length > 1){
            embedMsg
                .setColor(red)
                .setDescription(`${client.prefix}${this.name} takes one argument! The proper usage is ${client.prefix}${this.name} ${this.usage}`);
            
            return message.channel.send(embedMsg);
        }

        client.prefix = args[0];
        embedMsg.setDescription(`The prefix has been set to \`${client.prefix}\``);
        message.channel.send(embedMsg);
    }
}